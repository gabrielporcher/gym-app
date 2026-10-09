import {
  filterExercises,
  findExerciseById,
  recruitmentRole,
  recruitmentScore,
  normalizeSearchText,
  type CatalogExercise,
  type CatalogMuscleRecruitment,
  type EquipmentName,
  type ExerciseKind,
  type ExerciseQuery,
  type LoadTypeName,
  type MuscleGroupName,
  type RecruitmentScore,
} from './exercise-catalog';

test('triceps e Tríceps normalizam para o mesmo texto', () => {
  expect(normalizeSearchText('triceps')).toBe(normalizeSearchText('Tríceps'));
  expect(normalizeSearchText('triceps')).toBe('triceps');
});

test('áéíóúãõâêôç perde o acento', () => {
  expect(normalizeSearchText('áéíóúãõâêôç')).toBe('aeiouaoaeoc');
});

test('texto vazio ou só com espaços não restringe', () => {
  expect(normalizeSearchText('')).toBe('');
  expect(normalizeSearchText('   ')).toBe('');
});

test('5 é agonista principal, 4 é agonista secundário e 3 e 2 são sinergista', () => {
  expect(recruitmentRole(5)).toBe('primary-agonist');
  expect(recruitmentRole(4)).toBe('secondary-agonist');
  expect(recruitmentRole(3)).toBe('synergist');
  expect(recruitmentRole(2)).toBe('synergist');
});

test('nota ausente não vira 0', () => {
  expect(recruitmentRole(undefined)).toBeNull();
  expect(recruitmentRole(null)).toBeNull();
  expect(recruitmentRole(undefined)).not.toBe(0);
  expect(recruitmentRole(null)).not.toBe(0);
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
  aliases?: string[];
  equipment: EquipmentName;
  loadType: LoadTypeName;
  kind: ExerciseKind;
  unilateral?: boolean;
  recruitment: CatalogMuscleRecruitment[];
}): CatalogExercise {
  return {
    unilateral: false,
    aliases: [],
    ...input,
  };
}

const supinoRetoBarra = exercise({
  id: 'supino-reto-barra',
  name: 'Supino reto com barra',
  aliases: ['Supino reto', 'Supino com barra'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 3),
    scored('Deltoide anterior', 'Ombros', 3),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const supinoInclinadoBarra = exercise({
  id: 'supino-inclinado-barra',
  name: 'Supino inclinado com barra',
  aliases: ['Supino inclinado'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Peitoral superior', 'Peito', 5),
    scored('Peitoral médio-inferior', 'Peito', 3),
    scored('Deltoide anterior', 'Ombros', 4),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const supinoRetoHalteres = exercise({
  id: 'supino-reto-halteres',
  name: 'Supino reto com halteres',
  aliases: ['Supino com halteres'],
  equipment: 'Halteres',
  loadType: 'halter',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 3),
    scored('Deltoide anterior', 'Ombros', 3),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const supinoDeclinadoBarra = exercise({
  id: 'supino-declinado-barra',
  name: 'Supino declinado com barra',
  aliases: ['Supino declinado'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 2),
    scored('Deltoide anterior', 'Ombros', 2),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const supinoDeclinadoHalteres = exercise({
  id: 'supino-declinado-halteres',
  name: 'Supino declinado com halteres',
  aliases: ['Supino declinado com halter'],
  equipment: 'Halteres',
  loadType: 'halter',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 2),
    scored('Deltoide anterior', 'Ombros', 2),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const supinoFechadoBarra = exercise({
  id: 'supino-fechado-barra',
  name: 'Supino fechado com barra',
  aliases: ['Supino pegada fechada'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Tríceps cabeça lateral', 'Tríceps', 5),
    scored('Tríceps cabeça medial', 'Tríceps', 4),
    scored('Tríceps cabeça longa', 'Tríceps', 4),
    scored('Peitoral médio-inferior', 'Peito', 4),
    scored('Peitoral superior', 'Peito', 2),
    scored('Deltoide anterior', 'Ombros', 3),
  ],
});

const crucifixoReto = exercise({
  id: 'crucifixo-reto',
  name: 'Crucifixo reto com halteres',
  aliases: ['Crucifixo'],
  equipment: 'Halteres',
  loadType: 'halter',
  kind: 'isolation',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 3),
    scored('Deltoide anterior', 'Ombros', 2),
  ],
});

const agachamentoLivre = exercise({
  id: 'agachamento-livre',
  name: 'Agachamento livre',
  aliases: ['Agachamento com barra', 'Back squat'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'compound',
  recruitment: [
    scored('Vastos do quadríceps', 'Quadríceps', 5),
    scored('Glúteo máximo', 'Glúteos', 4),
    scored('Reto femoral', 'Quadríceps', 3),
    scored('Eretor da espinha', 'Costas', 3),
    scored('Bíceps femoral', 'Posterior de coxa', 2),
    scored('Semitendíneo e semimembranoso', 'Posterior de coxa', 2),
  ],
});

const cadeiraExtensora = exercise({
  id: 'cadeira-extensora',
  name: 'Cadeira extensora',
  aliases: ['Extensora'],
  equipment: 'Máquina',
  loadType: 'máquina',
  kind: 'isolation',
  recruitment: [
    scored('Reto femoral', 'Quadríceps', 5),
    scored('Vastos do quadríceps', 'Quadríceps', 4),
  ],
});

const tricepsTesta = exercise({
  id: 'triceps-testa',
  name: 'Tríceps testa com barra W',
  aliases: ['Tríceps testa', 'Skull crusher'],
  equipment: 'Barra W',
  loadType: 'barra',
  kind: 'isolation',
  recruitment: [
    scored('Tríceps cabeça longa', 'Tríceps', 5),
    scored('Tríceps cabeça lateral', 'Tríceps', 4),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
  ],
});

const roscaDireta = exercise({
  id: 'rosca-direta',
  name: 'Rosca direta com barra',
  aliases: ['Rosca direta'],
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'isolation',
  recruitment: [
    scored('Bíceps braquial', 'Bíceps', 5),
    scored('Braquial', 'Bíceps', 3),
  ],
});

const voador = exercise({
  id: 'voador',
  name: 'Voador',
  aliases: ['Peck deck', 'Crucifixo na máquina'],
  equipment: 'Máquina',
  loadType: 'máquina',
  kind: 'isolation',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 4),
    scored('Deltoide anterior', 'Ombros', 2),
  ],
});

const puxadaFrontal = exercise({
  id: 'puxada-frontal',
  name: 'Puxada frontal',
  aliases: ['Puxada aberta', 'Lat pulldown'],
  equipment: 'Cabo',
  loadType: 'cabo',
  kind: 'compound',
  recruitment: [
    scored('Latíssimo do dorso', 'Costas', 5),
    scored('Romboides', 'Costas', 3),
    scored('Trapézio médio', 'Costas', 3),
    scored('Bíceps braquial', 'Bíceps', 3),
    scored('Braquial', 'Bíceps', 2),
  ],
});

const flexao = exercise({
  id: 'flexao',
  name: 'Flexão de braços',
  aliases: ['Flexão'],
  equipment: 'Peso corporal',
  loadType: 'peso corporal',
  kind: 'compound',
  recruitment: [
    scored('Peitoral médio-inferior', 'Peito', 5),
    scored('Peitoral superior', 'Peito', 3),
    scored('Deltoide anterior', 'Ombros', 3),
    scored('Tríceps cabeça lateral', 'Tríceps', 3),
    scored('Tríceps cabeça medial', 'Tríceps', 3),
    scored('Tríceps cabeça longa', 'Tríceps', 2),
  ],
});

const encolhimento = exercise({
  id: 'encolhimento',
  name: 'Encolhimento com barra',
  equipment: 'Barra',
  loadType: 'barra',
  kind: 'isolation',
  recruitment: [scored('Trapézio superior', 'Costas', 5)],
});

const fixtures = [
  supinoRetoBarra,
  supinoInclinadoBarra,
  supinoRetoHalteres,
  supinoDeclinadoBarra,
  supinoDeclinadoHalteres,
  supinoFechadoBarra,
  crucifixoReto,
  agachamentoLivre,
  cadeiraExtensora,
  tricepsTesta,
  roscaDireta,
  voador,
  puxadaFrontal,
  flexao,
  encolhimento,
];

function names(query: ExerciseQuery = {}, source: readonly CatalogExercise[] = fixtures): string[] {
  return filterExercises(source, query).map((item) => item.name);
}

test('recrutamento ausente de Supino reto com barra não vira 0', () => {
  expect(recruitmentScore(supinoRetoBarra, 'Deltoide lateral')).toBeUndefined();
  expect(recruitmentRole(recruitmentScore(supinoRetoBarra, 'Deltoide lateral'))).toBeNull();
  expect(recruitmentRole(recruitmentScore(supinoRetoBarra, 'Deltoide lateral'))).not.toBe(0);
});

test('busca por trecho, nome alternativo, acento, caixa e texto vazio', () => {
  expect(names({ text: 'supino' })).toEqual(
    expect.arrayContaining(['Supino reto com barra', 'Supino inclinado com barra']),
  );
  expect(names({ text: 'supino' })).not.toContain('Rosca direta com barra');
  expect(names({ text: 'voador' })).toEqual(['Voador']);
  expect(names({ text: 'triceps' })).toContain('Tríceps testa com barra W');
  expect(names({ text: 'PUXADA FRONTAL' })).toContain('Puxada frontal');
  expect(names({ text: '   ' })).toEqual(names());
  expect(names({ text: 'burpee' })).toEqual([]);
  expect(encolhimento.aliases).toEqual([]);
  expect(names({ text: 'Encolhimento com barra' })).toContain('Encolhimento com barra');
});

test('filtro de grupo usa nota 4 ou 5 e ignora grupo desconhecido', () => {
  expect(names({ muscleGroup: 'Peito' })).toContain('Supino reto com barra');
  expect(names({ muscleGroup: 'Tríceps' })).not.toContain('Supino reto com barra');
  expect(names({ muscleGroup: 'Tríceps' })).toContain('Tríceps testa com barra W');
  expect(names({ muscleGroup: 'Ombros' })).toContain('Supino inclinado com barra');
  expect(names({ muscleGroup: 'Ombros' })).not.toContain('Supino reto com barra');
  expect(names({ muscleGroup: 'Glúteos' })).toContain('Agachamento livre');
  expect(names({ muscleGroup: 'Glúteos' })).not.toContain('Cadeira extensora');
  expect(names({ text: 'agachamento' })).toContain('Agachamento livre');
  expect(names({ muscleGroup: 'Cardio' })).toEqual([]);
  expect(names({ muscleGroup: 'Deltoide lateral' })).toEqual([]);
  expect(recruitmentScore(supinoRetoBarra, 'Deltoide anterior')?.valueOf()).toBe(3);
});

test('filtro de equipamento e a combinação com texto e grupo', () => {
  expect(names({ equipment: 'Halteres' })).toEqual(
    expect.arrayContaining(['Supino reto com halteres', 'Crucifixo reto com halteres']),
  );
  expect(names({ equipment: 'Halteres' })).not.toContain('Supino reto com barra');
  expect(names({ text: 'supino reto' })).toEqual(
    expect.arrayContaining(['Supino reto com barra', 'Supino reto com halteres']),
  );
  expect(names({ muscleGroup: 'Peito', equipment: 'Halteres' })).toEqual(
    expect.arrayContaining(['Crucifixo reto com halteres', 'Supino reto com halteres']),
  );
  expect(names({ muscleGroup: 'Peito', equipment: 'Halteres' })).not.toContain('Supino reto com barra');
  expect(names({ text: 'declinado', muscleGroup: 'Peito', equipment: 'Barra' })).toEqual([
    'Supino declinado com barra',
  ]);
  expect(names({ text: 'rosca', muscleGroup: 'Peito', equipment: 'Barra' })).toEqual([]);
  expect(names({ equipment: 'Kettlebell' })).toEqual([]);
});

test('limpar texto e filtros devolve a base e não altera a lista', () => {
  const subset = names({ text: 'supino', muscleGroup: 'Peito', equipment: 'Barra' });
  expect(subset.length).toBeGreaterThan(0);
  expect(subset.length).toBeLessThan(fixtures.length);

  const snapshot = JSON.stringify(fixtures);
  expect(names()).toHaveLength(fixtures.length);
  expect(JSON.stringify(fixtures)).toBe(snapshot);
});

test('resultado em ordem pt-BR e sem duplicar o mesmo exercício', () => {
  const ordered = names({ text: 'supino' });
  expect(ordered.indexOf('Supino declinado com barra')).toBeLessThan(
    ordered.indexOf('Supino fechado com barra'),
  );
  expect(ordered.indexOf('Supino inclinado com barra')).toBeLessThan(
    ordered.indexOf('Supino reto com barra'),
  );

  const duplicated = filterExercises([voador, voador, ...fixtures], { text: 'voador' });
  expect(duplicated).toHaveLength(1);
  expect(duplicated[0]?.id).toBe(voador.id);
});

test('identidade permanece na correção e some quando o item é retirado ou não existe', () => {
  const renamed = {
    ...supinoRetoBarra,
    name: 'Supino horizontal com barra',
    aliases: ['Supino com barra'],
  };
  const afterRename = fixtures.map((item) => (item.id === renamed.id ? renamed : item));
  expect(filterExercises(afterRename, { text: 'Supino horizontal com barra' })[0]?.id).toBe(
    supinoRetoBarra.id,
  );
  expect(names({ text: 'Supino reto com barra' }, afterRename)).not.toContain('Supino reto com barra');

  const rescored = {
    ...supinoRetoBarra,
    recruitment: supinoRetoBarra.recruitment.map((row) =>
      row.muscleName === 'Peitoral médio-inferior' ? { ...row, recruitment: 4 as const } : row,
    ),
  };
  expect(findExerciseById([rescored], supinoRetoBarra.id)?.id).toBe(supinoRetoBarra.id);
  expect(recruitmentScore(rescored, 'Peitoral médio-inferior')).toBe(4);

  const removed = { ...supinoRetoBarra, removed: true };
  const replacement = { ...roscaDireta, id: 'outro-supino', name: 'Supino reto com barra' };
  const afterRemoval = fixtures.map((item) => (item.id === removed.id ? removed : item));
  expect(names({ text: 'Supino reto com barra' }, afterRemoval)).not.toContain('Supino reto com barra');
  expect(findExerciseById([removed, replacement], supinoRetoBarra.id)).toBeUndefined();
  expect(replacement.id).not.toBe(supinoRetoBarra.id);
  expect(findExerciseById(fixtures, 'identidade-inexistente')).toBeUndefined();
});

test('atributos pinados das fixtures de consulta', () => {
  expect(supinoRetoBarra).toMatchObject({
    equipment: 'Barra',
    loadType: 'barra',
    kind: 'compound',
    unilateral: false,
  });
  expect(crucifixoReto).toMatchObject({ kind: 'isolation', unilateral: false, equipment: 'Halteres', loadType: 'halter' });
  expect(flexao).toMatchObject({ equipment: 'Peso corporal', loadType: 'peso corporal' });
  expect(puxadaFrontal).toMatchObject({ equipment: 'Cabo', loadType: 'cabo' });
  expect(recruitmentRole(recruitmentScore(supinoRetoBarra, 'Peitoral médio-inferior'))).toBe(
    'primary-agonist',
  );
  expect(recruitmentRole(recruitmentScore(supinoInclinadoBarra, 'Deltoide anterior'))).toBe(
    'secondary-agonist',
  );
  expect(recruitmentRole(recruitmentScore(agachamentoLivre, 'Bíceps femoral'))).toBe('synergist');
  expect(recruitmentScore(tricepsTesta, 'Peitoral médio-inferior')).toBeUndefined();
});
