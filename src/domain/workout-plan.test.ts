import {
  type CatalogExercise,
  type CatalogMuscleRecruitment,
  type EquipmentName,
  type ExerciseKind,
  type LoadTypeName,
  type MuscleGroupName,
  type RecruitmentScore,
} from './exercise-catalog';
import {
  addWorkoutDay,
  allocateExercise,
  applyExerciseTarget,
  buildPlanDraft,
  canAddWorkoutDay,
  changeEmphasis,
  confirmName,
  EMPTY_EXERCISE_TARGET,
  freeWeekdays,
  listExercisesForDay,
  moveExercise,
  moveWorkoutDay,
  removeWorkoutDay,
  SPLIT_TEMPLATES,
  type DraftWorkoutDay,
  type ExerciseTarget,
  type SplitTemplateId,
  type Weekday,
  type WorkoutPlanDraft,
} from './workout-plan';

const EXCLUDED_PROGRAMS = ['Arnold', 'PHUL', 'PHAT', 'PPLUL'];

const PHRASES: Record<SplitTemplateId, string> = {
  'full-body':
    'O mesmo tipo de treino, com o corpo todo, três vezes na semana. Dá para tirar ou acrescentar dias depois.',
  'upper-lower':
    'Quatro treinos: superiores na segunda e na quinta, inferiores na terça e na sexta. Os dois dias de superiores são independentes.',
  'push-pull-legs': 'Três treinos: push, pull e pernas, em dias alternados.',
  'push-pull-legs-2x':
    'O ciclo push, pull e pernas repetido na semana. A segunda ocorrência de cada um começa igual e pode ser editada à parte.',
  abc: 'Três treinos diferentes, A, B e C, em dias alternados.',
  'abc-2x': 'A, B e C duas vezes na semana. O A da segunda vez é outro dia: pode ficar igual ou mudar.',
  abcd: 'Quatro treinos diferentes ao longo da semana.',
  abcde: 'Cinco treinos diferentes, um por dia útil, começando por peito, costas, pernas, ombros e braços.',
  custom: 'Começa com um dia, sem grupos sugeridos. Os outros dias e os grupos ficam por sua conta.',
};

const TEMPLATE_ORDER: { id: SplitTemplateId; name: string }[] = [
  { id: 'full-body', name: 'Corpo inteiro' },
  { id: 'upper-lower', name: 'Superiores e inferiores' },
  { id: 'push-pull-legs', name: 'Push Pull Legs' },
  { id: 'push-pull-legs-2x', name: 'Push Pull Legs 2x' },
  { id: 'abc', name: 'ABC' },
  { id: 'abc-2x', name: 'ABC 2x' },
  { id: 'abcd', name: 'ABCD' },
  { id: 'abcde', name: 'ABCDE' },
  { id: 'custom', name: 'Personalizado' },
];

const UPPER: MuscleGroupName[] = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'];
const LOWER: MuscleGroupName[] = ['Quadríceps', 'Posterior de coxa', 'Glúteos', 'Adutores', 'Panturrilhas'];
const PUSH: MuscleGroupName[] = ['Peito', 'Ombros', 'Tríceps'];
const PULL: MuscleGroupName[] = ['Costas', 'Bíceps', 'Antebraço'];

function draftOf(templateId: SplitTemplateId): WorkoutPlanDraft {
  return buildPlanDraft(templateId);
}

function at(draft: WorkoutPlanDraft, weekday: Weekday): DraftWorkoutDay | null {
  return draft.days.find((workoutDay) => workoutDay.weekday === weekday) ?? null;
}

function expectGroups(workoutDay: DraftWorkoutDay | null, groups: readonly MuscleGroupName[]) {
  expect(workoutDay?.emphasis).toEqual({ mode: 'groups', groups });
}

function expectRest(draft: WorkoutPlanDraft, ...weekdays: Weekday[]) {
  for (const weekday of weekdays) {
    expect(at(draft, weekday)).toBeNull();
  }
}

test('os nove modelos aparecem nessa ordem, com a frase, e sem Arnold, PHUL, PHAT ou PPLUL', () => {
  expect(SPLIT_TEMPLATES.map((template) => ({ id: template.id, name: template.name }))).toEqual(TEMPLATE_ORDER);

  for (const template of SPLIT_TEMPLATES) {
    expect(template.description).toBe(PHRASES[template.id]);
  }

  const visible = SPLIT_TEMPLATES.flatMap((template) => [template.id, template.name, template.description]).join('\n');
  for (const program of EXCLUDED_PROGRAMS) {
    expect(visible).not.toContain(program);
  }
});

test('Superiores e inferiores nasce com a semana de quatro treinos', () => {
  const draft = draftOf('upper-lower');
  expect(draft.name).toBe('Superiores e inferiores');
  expect(at(draft, 1)?.name).toBe('Superiores 1');
  expectGroups(at(draft, 1), UPPER);
  expect(at(draft, 2)?.name).toBe('Inferiores 1');
  expectGroups(at(draft, 2), LOWER);
  expectRest(draft, 3);
  expect(at(draft, 4)?.name).toBe('Superiores 2');
  expectGroups(at(draft, 4), UPPER);
  expect(at(draft, 5)?.name).toBe('Inferiores 2');
  expectGroups(at(draft, 5), LOWER);
  expectRest(draft, 6, 7);
});

test('Corpo inteiro nasce em três dias alternados, sem os doze grupos', () => {
  const draft = draftOf('full-body');
  expect(draft.name).toBe('Corpo inteiro');
  expect(at(draft, 1)?.name).toBe('Corpo inteiro 1');
  expect(at(draft, 3)?.name).toBe('Corpo inteiro 2');
  expect(at(draft, 5)?.name).toBe('Corpo inteiro 3');
  for (const weekday of [1, 3, 5] as const) {
    expect(at(draft, weekday)?.emphasis).toEqual({ mode: 'full-body' });
  }
  expectRest(draft, 2, 4, 6, 7);
});

test('Push Pull Legs nasce em segunda, quarta e sexta', () => {
  const draft = draftOf('push-pull-legs');
  expect(at(draft, 1)?.name).toBe('Push');
  expectGroups(at(draft, 1), PUSH);
  expect(at(draft, 3)?.name).toBe('Pull');
  expectGroups(at(draft, 3), PULL);
  expect(at(draft, 3)?.emphasis).not.toEqual(expect.objectContaining({ groups: expect.arrayContaining(['Ombros']) }));
  expect(at(draft, 5)?.name).toBe('Pernas');
  expectGroups(at(draft, 5), LOWER);
  expectRest(draft, 2, 4, 6, 7);
});

test('Push Pull Legs 2x repete o ciclo e Push 2 começa com as tags de Push', () => {
  const draft = draftOf('push-pull-legs-2x');
  expect(at(draft, 1)?.name).toBe('Push');
  expect(at(draft, 2)?.name).toBe('Pull');
  expect(at(draft, 3)?.name).toBe('Pernas');
  expect(at(draft, 4)?.name).toBe('Push 2');
  expect(at(draft, 5)?.name).toBe('Pull 2');
  expect(at(draft, 6)?.name).toBe('Pernas 2');
  expectRest(draft, 7);
  expect(at(draft, 4)?.emphasis).toEqual(at(draft, 1)?.emphasis);
  expect(at(draft, 4)?.emphasis).not.toBe(at(draft, 1)?.emphasis);
});

test('ABC nasce em dias alternados', () => {
  const draft = draftOf('abc');
  expect(at(draft, 1)?.name).toBe('Treino A');
  expectGroups(at(draft, 1), PUSH);
  expect(at(draft, 3)?.name).toBe('Treino B');
  expectGroups(at(draft, 3), ['Costas', 'Bíceps']);
  expect(at(draft, 5)?.name).toBe('Treino C');
  expectGroups(at(draft, 5), LOWER);
  expectRest(draft, 2, 4, 6, 7);
});

test('ABC 2x repete A, B e C e os dois A começam iguais', () => {
  const draft = draftOf('abc-2x');
  expect(at(draft, 1)?.name).toBe('Treino A1');
  expect(at(draft, 2)?.name).toBe('Treino B1');
  expect(at(draft, 3)?.name).toBe('Treino C1');
  expect(at(draft, 4)?.name).toBe('Treino A2');
  expect(at(draft, 5)?.name).toBe('Treino B2');
  expect(at(draft, 6)?.name).toBe('Treino C2');
  expectRest(draft, 7);
  expectGroups(at(draft, 1), PUSH);
  expectGroups(at(draft, 4), PUSH);
});

test('ABCD deixa quarta, sábado e domingo em descanso', () => {
  const draft = draftOf('abcd');
  expect(at(draft, 1)?.name).toBe('Treino A');
  expectGroups(at(draft, 1), ['Peito', 'Tríceps']);
  expect(at(draft, 2)?.name).toBe('Treino B');
  expectGroups(at(draft, 2), ['Costas', 'Bíceps']);
  expect(at(draft, 4)?.name).toBe('Treino C');
  expectGroups(at(draft, 4), LOWER);
  expect(at(draft, 5)?.name).toBe('Treino D');
  expectGroups(at(draft, 5), ['Ombros', 'Bíceps', 'Tríceps']);
  expectRest(draft, 3, 6, 7);
});

test('ABCDE começa por peito, costas, pernas, ombros e braços', () => {
  const draft = draftOf('abcde');
  expect(at(draft, 1)?.name).toBe('Treino A');
  expectGroups(at(draft, 1), ['Peito']);
  expect(at(draft, 2)?.name).toBe('Treino B');
  expectGroups(at(draft, 2), ['Costas']);
  expect(at(draft, 3)?.name).toBe('Treino C');
  expectGroups(at(draft, 3), LOWER);
  expect(at(draft, 4)?.name).toBe('Treino D');
  expectGroups(at(draft, 4), ['Ombros']);
  expect(at(draft, 5)?.name).toBe('Treino E');
  expectGroups(at(draft, 5), ['Bíceps', 'Tríceps', 'Antebraço']);
  expectRest(draft, 6, 7);
});

test('Personalizado nasce com Treino 1 na segunda, sem tag', () => {
  const draft = draftOf('custom');
  expect(draft.name).toBe('Personalizado');
  expect(at(draft, 1)?.name).toBe('Treino 1');
  expect(at(draft, 1)?.emphasis).toEqual({ mode: 'groups', groups: [] });
  expectRest(draft, 2, 3, 4, 5, 6, 7);
});

test('upper/lower ganha a quarta-feira como Treino 1, sem tags', () => {
  const days = draftOf('upper-lower').days;
  const added = addWorkoutDay(days);
  expect(added.ok).toBe(true);
  if (!added.ok) {
    return;
  }

  expect(added.added).toEqual({ name: 'Treino 1', weekday: 3, emphasis: { mode: 'groups', groups: [] } });
  expect(added.days.find((workoutDay) => workoutDay.name === 'Superiores 1')?.weekday).toBe(1);
  expect(added.days.find((workoutDay) => workoutDay.name === 'Inferiores 1')?.weekday).toBe(2);
  expect(added.days.find((workoutDay) => workoutDay.name === 'Superiores 2')?.weekday).toBe(4);
  expect(added.days.find((workoutDay) => workoutDay.name === 'Inferiores 2')?.weekday).toBe(5);
});

test('semana de sete dias recusa o oitavo', () => {
  let days = draftOf('custom').days;
  for (let index = 0; index < 6; index += 1) {
    const added = addWorkoutDay(days);
    expect(added.ok).toBe(true);
    if (!added.ok) {
      return;
    }
    days = added.days;
  }

  expect(days).toHaveLength(7);
  expect(canAddWorkoutDay(days)).toBe(false);
  const refused = addWorkoutDay(days);
  expect(refused.ok).toBe(false);
  if (!refused.ok) {
    expect(refused.reason).toBe('week-full');
    expect(refused.days).toHaveLength(7);
  }
});

test('remover Inferiores 2 devolve a sexta ao descanso e não altera os outros dias', () => {
  const days = draftOf('upper-lower').days;
  const removed = removeWorkoutDay(days, 5);
  expect(removed.ok).toBe(true);
  if (!removed.ok) {
    return;
  }

  expect(removed.days.find((workoutDay) => workoutDay.name === 'Inferiores 2')).toBeUndefined();
  expect(removed.days.find((workoutDay) => workoutDay.weekday === 5)).toBeUndefined();
  expect(removed.days.find((workoutDay) => workoutDay.name === 'Superiores 1')).toEqual(
    days.find((workoutDay) => workoutDay.name === 'Superiores 1'),
  );
  expect(removed.days.find((workoutDay) => workoutDay.name === 'Inferiores 1')?.weekday).toBe(2);
  expect(removed.days.find((workoutDay) => workoutDay.name === 'Superiores 2')?.weekday).toBe(4);
});

test('o último dia não sai', () => {
  const days = draftOf('custom').days;
  const removed = removeWorkoutDay(days, 1);
  expect(removed.ok).toBe(false);
  if (!removed.ok) {
    expect(removed.reason).toBe('last-day');
    expect(removed.days.map((workoutDay) => workoutDay.name)).toEqual(['Treino 1']);
  }
});

test('Superiores 2 move para quarta e a quinta fica livre', () => {
  const days = draftOf('upper-lower').days;
  const moved = moveWorkoutDay(days, 4, 3);
  expect(moved.ok).toBe(true);
  if (!moved.ok) {
    return;
  }

  expect(moved.days.find((workoutDay) => workoutDay.name === 'Superiores 2')?.weekday).toBe(3);
  expect(moved.days.find((workoutDay) => workoutDay.weekday === 4)).toBeUndefined();
  expect(moved.days.find((workoutDay) => workoutDay.name === 'Inferiores 2')?.weekday).toBe(5);
});

test('destino ocupado não é oferecido e cancelar não altera o weekday', () => {
  const days = draftOf('upper-lower').days;
  const snapshot = days.map((workoutDay) => ({ name: workoutDay.name, weekday: workoutDay.weekday }));
  expect(freeWeekdays(days)).not.toContain(1);

  const refused = moveWorkoutDay(days, 4, 1);
  expect(refused.ok).toBe(false);
  if (!refused.ok) {
    expect(refused.reason).toBe('occupied');
    expect(refused.days.find((workoutDay) => workoutDay.name === 'Superiores 2')?.weekday).toBe(4);
  }

  expect(days.map((workoutDay) => ({ name: workoutDay.name, weekday: workoutDay.weekday }))).toEqual(snapshot);
});

function scored(
  muscleName: string,
  groupName: MuscleGroupName,
  recruitment: RecruitmentScore,
): CatalogMuscleRecruitment {
  return { muscleId: muscleName, muscleName, groupName, recruitment };
}

function exercise(input: {
  id: string;
  name: string;
  equipment: EquipmentName;
  loadType: LoadTypeName;
  kind: ExerciseKind;
  recruitment: CatalogMuscleRecruitment[];
  aliases?: string[];
}): CatalogExercise {
  return { unilateral: false, aliases: [], ...input };
}

const supinoReto = exercise({
  id: 'supino-reto',
  name: 'Supino reto com barra',
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Deltoide anterior', 'Ombros', 3),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
  ],
});

const supinoInclinado = exercise({
  id: 'supino-inclinado',
  name: 'Supino inclinado com barra',
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Peitoral superior', 'Peito', 5),
    scored('Deltoide anterior', 'Ombros', 4),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
  ],
});

const remada = exercise({
  id: 'remada',
  name: 'Remada curvada com barra',
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Latíssimo do dorso', 'Costas', 5),
    scored('Bíceps braquial', 'Bíceps', 3),
  ],
});

const agachamento = exercise({
  id: 'agachamento',
  name: 'Agachamento livre',
  aliases: ['Agachamento com barra'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Vastos do quadríceps', 'Quadríceps', 5),
    scored('Glúteo máximo', 'Glúteos', 4),
  ],
});

const extensora = exercise({
  id: 'extensora',
  name: 'Cadeira extensora',
  equipment: 'Máquina',
  loadType: 'máquina',
  kind: 'isolation',
  recruitment: [scored('Reto femoral', 'Quadríceps', 5)],
});

const tricepsTesta = exercise({
  id: 'triceps-testa',
  name: 'Tríceps testa com barra W',
  equipment: 'Barra W',
  loadType: 'barra',
  kind: 'isolation',
  recruitment: [scored('Tríceps cabeça longa', 'Tríceps', 5)],
});

const selectorFixtures = [supinoReto, supinoInclinado, remada, agachamento, extensora, tricepsTesta];

function selectorNames(emphasis: DraftWorkoutDay['emphasis'], query: { text?: string; muscleGroup?: string } = {}) {
  return listExercisesForDay(selectorFixtures, query, emphasis).exercises.map((item) => item.name);
}

test('Peito antes de Costas antes do resto, e o agachamento continua na lista', () => {
  const names = selectorNames({ mode: 'groups', groups: ['Peito', 'Costas'] });
  expect(names.indexOf('Supino reto com barra')).toBeLessThan(names.indexOf('Remada curvada com barra'));
  expect(names.indexOf('Remada curvada com barra')).toBeLessThan(names.indexOf('Agachamento livre'));
  expect(names).toContain('Agachamento livre');
});

test('Tríceps não puxa o supino, que continua na lista', () => {
  const names = selectorNames({ mode: 'groups', groups: ['Tríceps'] });
  expect(names.indexOf('Tríceps testa com barra W')).toBeLessThan(names.indexOf('Supino reto com barra'));
  expect(names).toContain('Supino reto com barra');
});

test('no mesmo grupo, composto vem antes de isolado', () => {
  const names = selectorNames({ mode: 'groups', groups: ['Quadríceps'] });
  expect(names.indexOf('Agachamento livre')).toBeLessThan(names.indexOf('Cadeira extensora'));
});

test('mesmo grupo e mesmo tipo ordenam pelo nome em pt-BR', () => {
  const names = selectorNames({ mode: 'groups', groups: ['Peito'] });
  expect(names.indexOf('Supino inclinado com barra')).toBeLessThan(names.indexOf('Supino reto com barra'));
});

test('corpo inteiro lista compostos antes dos isolados', () => {
  const names = selectorNames({ mode: 'full-body' });
  expect(names.indexOf('Agachamento livre')).toBeLessThan(names.indexOf('Supino reto com barra'));
  expect(names.indexOf('Supino reto com barra')).toBeLessThan(names.indexOf('Cadeira extensora'));
});

test('sem tag, o seletor segue o nome em pt-BR', () => {
  const names = selectorNames({ mode: 'groups', groups: [] });
  expect(names.indexOf('Agachamento livre')).toBeLessThan(names.indexOf('Cadeira extensora'));
  expect(names.indexOf('Cadeira extensora')).toBeLessThan(names.indexOf('Supino reto com barra'));
});

test('busca agachamento num dia de peito esconde o supino', () => {
  const list = listExercisesForDay(selectorFixtures, { text: 'agachamento' }, { mode: 'groups', groups: ['Peito'] });
  expect(list.exercises.map((item) => item.name)).toContain('Agachamento livre');
  expect(list.exercises.map((item) => item.name)).not.toContain('Supino reto com barra');
});

test('busca kettlebell deixa o seletor vazio', () => {
  const list = listExercisesForDay(selectorFixtures, { text: 'kettlebell' }, { mode: 'groups', groups: ['Peito'] });
  expect(list.exercises).toEqual([]);
});

test('filtro Quadríceps num dia de Peito mostra o agachamento e esconde o supino', () => {
  const names = selectorNames({ mode: 'groups', groups: ['Peito'] }, { muscleGroup: 'Quadríceps' });
  expect(names).toContain('Agachamento livre');
  expect(names).not.toContain('Supino reto com barra');
});

test('Sugeridos e Outros só quando há grupos e as duas partes têm item', () => {
  const chestAndBack = listExercisesForDay(selectorFixtures, {}, { mode: 'groups', groups: ['Peito', 'Costas'] });
  expect(chestAndBack.titled).toBe(true);
  expect(chestAndBack.suggested.map((item) => item.name)).toEqual(
    expect.arrayContaining(['Supino reto com barra', 'Remada curvada com barra']),
  );
  expect(chestAndBack.others.map((item) => item.name)).toContain('Agachamento livre');

  expect(listExercisesForDay(selectorFixtures, {}, { mode: 'full-body' }).titled).toBe(false);
  expect(listExercisesForDay(selectorFixtures, {}, { mode: 'groups', groups: [] }).titled).toBe(false);
  expect(
    listExercisesForDay(selectorFixtures, { muscleGroup: 'Quadríceps' }, { mode: 'groups', groups: ['Peito'] }).titled,
  ).toBe(false);
});

const RANGE_TARGET: ExerciseTarget = { sets: 3, repMin: 8, repMax: 12 };

test('meta vazia, só séries, faixa 3/8/12, 8/8 e limpar são aceitos', () => {
  expect(applyExerciseTarget(RANGE_TARGET, EMPTY_EXERCISE_TARGET)).toEqual({
    ok: true,
    target: EMPTY_EXERCISE_TARGET,
  });
  expect(applyExerciseTarget(EMPTY_EXERCISE_TARGET, { sets: 3, repMin: null, repMax: null })).toEqual({
    ok: true,
    target: { sets: 3, repMin: null, repMax: null },
  });
  expect(applyExerciseTarget(EMPTY_EXERCISE_TARGET, RANGE_TARGET)).toEqual({ ok: true, target: RANGE_TARGET });
  expect(applyExerciseTarget(EMPTY_EXERCISE_TARGET, { sets: null, repMin: 8, repMax: 8 })).toEqual({
    ok: true,
    target: { sets: null, repMin: 8, repMax: 8 },
  });
  expect(applyExerciseTarget(RANGE_TARGET, EMPTY_EXERCISE_TARGET).target).toEqual(EMPTY_EXERCISE_TARGET);
});

test('máximo menor que o mínimo e zero não substituem a meta anterior', () => {
  expect(applyExerciseTarget(RANGE_TARGET, { sets: 3, repMin: 8, repMax: 6 })).toEqual({
    ok: false,
    target: RANGE_TARGET,
  });
  expect(applyExerciseTarget(EMPTY_EXERCISE_TARGET, { sets: 0, repMin: null, repMax: null })).toEqual({
    ok: false,
    target: EMPTY_EXERCISE_TARGET,
  });
});

test('nome vazio mantém o anterior', () => {
  expect(confirmName('Superiores e inferiores', '')).toBe('Superiores e inferiores');
  expect(confirmName('Superiores e inferiores', '   ')).toBe('Superiores e inferiores');
  expect(confirmName('Superiores 1', '')).toBe('Superiores 1');
  expect(confirmName('Superiores 1', 'Peito')).toBe('Peito');
});

test('tirar Ombros e pôr Abdômen, e corpo inteiro vira um grupo', () => {
  const upper = { mode: 'groups' as const, groups: ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'] as const };
  const withoutShoulders = changeEmphasis(upper, { type: 'remove-group', group: 'Ombros' });
  const withAbs = changeEmphasis(withoutShoulders, { type: 'add-group', group: 'Abdômen' });
  expect(withAbs).toEqual({ mode: 'groups', groups: ['Peito', 'Costas', 'Bíceps', 'Tríceps', 'Abdômen'] });

  expect(changeEmphasis({ mode: 'full-body' }, { type: 'add-group', group: 'Peito' })).toEqual({
    mode: 'groups',
    groups: ['Peito'],
  });
  expect(changeEmphasis(upper, { type: 'remove-group', group: 'Peito' }).mode).toBe('groups');
  expect(changeEmphasis({ mode: 'groups', groups: ['Peito'] }, { type: 'remove-group', group: 'Peito' })).toEqual({
    mode: 'groups',
    groups: [],
  });
});

test('tag removida de Treino A1 não altera Treino A2', () => {
  const draft = buildPlanDraft('abc-2x');
  const first = draft.days.find((workoutDay) => workoutDay.name === 'Treino A1');
  const second = draft.days.find((workoutDay) => workoutDay.name === 'Treino A2');
  if (!first || !second) {
    throw new Error('dias A ausentes');
  }
  const updated = changeEmphasis(first.emphasis, { type: 'remove-group', group: 'Peito' });
  expect(updated).toEqual({ mode: 'groups', groups: ['Ombros', 'Tríceps'] });
  expect(second.emphasis).toEqual({ mode: 'groups', groups: ['Peito', 'Ombros', 'Tríceps'] });
});

test('o mesmo exercício entra uma vez e a ordem sobe ou desce uma posição', () => {
  const first = allocateExercise([], 'supino');
  expect(first.ok).toBe(true);
  if (!first.ok) {
    return;
  }
  const second = allocateExercise(first.exerciseIds, 'remada');
  const third = second.ok ? allocateExercise(second.exerciseIds, 'agachamento') : second;
  expect(third.ok && third.exerciseIds).toEqual(['supino', 'remada', 'agachamento']);
  const duplicate = allocateExercise(['supino', 'remada', 'agachamento'], 'supino');
  expect(duplicate).toEqual({ ok: false, reason: 'duplicate', exerciseIds: ['supino', 'remada', 'agachamento'] });
  expect(moveExercise(['supino', 'remada', 'agachamento'], 'agachamento', 'up')).toEqual([
    'supino',
    'agachamento',
    'remada',
  ]);
  expect(moveExercise(['supino', 'remada'], 'supino', 'up')).toEqual(['supino', 'remada']);
  expect(moveExercise(['supino', 'agachamento'], 'agachamento', 'down')).toEqual(['supino', 'agachamento']);
});
