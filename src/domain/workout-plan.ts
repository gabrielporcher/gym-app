import {
  filterExercises,
  MUSCLE_GROUP_NAMES,
  type CatalogExercise,
  type ExerciseKind,
  type ExerciseQuery,
  type MuscleGroupName,
} from './exercise-catalog';

export const SPLIT_TEMPLATE_IDS = [
  'full-body',
  'upper-lower',
  'push-pull-legs',
  'push-pull-legs-2x',
  'abc',
  'abc-2x',
  'abcd',
  'abcde',
  'custom',
] as const;

export type SplitTemplateId = (typeof SPLIT_TEMPLATE_IDS)[number];

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const satisfies readonly Weekday[];

export type DayEmphasis =
  | { mode: 'full-body' }
  | { mode: 'groups'; groups: readonly MuscleGroupName[] };

export type DraftWorkoutDay = {
  name: string;
  weekday: Weekday;
  emphasis: DayEmphasis;
};

export type SplitTemplate = {
  id: SplitTemplateId;
  name: string;
  description: string;
  days: readonly DraftWorkoutDay[];
};

export type WorkoutPlanDraft = {
  templateId: SplitTemplateId;
  name: string;
  days: DraftWorkoutDay[];
};

const UPPER_GROUPS = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'] as const satisfies readonly MuscleGroupName[];
const LOWER_GROUPS = [
  'Quadríceps',
  'Posterior de coxa',
  'Glúteos',
  'Adutores',
  'Panturrilhas',
] as const satisfies readonly MuscleGroupName[];
const PUSH_GROUPS = ['Peito', 'Ombros', 'Tríceps'] as const satisfies readonly MuscleGroupName[];
const PULL_GROUPS = ['Costas', 'Bíceps', 'Antebraço'] as const satisfies readonly MuscleGroupName[];
const ABC_B_GROUPS = ['Costas', 'Bíceps'] as const satisfies readonly MuscleGroupName[];
const ABCD_A_GROUPS = ['Peito', 'Tríceps'] as const satisfies readonly MuscleGroupName[];
const ABCD_D_GROUPS = ['Ombros', 'Bíceps', 'Tríceps'] as const satisfies readonly MuscleGroupName[];
const ARMS_GROUPS = ['Bíceps', 'Tríceps', 'Antebraço'] as const satisfies readonly MuscleGroupName[];

function groups(names: readonly MuscleGroupName[]): DayEmphasis {
  return { mode: 'groups', groups: [...names] };
}

function fullBody(): DayEmphasis {
  return { mode: 'full-body' };
}

function day(name: string, weekday: Weekday, emphasis: DayEmphasis): DraftWorkoutDay {
  return { name, weekday, emphasis: copyEmphasis(emphasis) };
}

function copyEmphasis(emphasis: DayEmphasis): DayEmphasis {
  if (emphasis.mode === 'full-body') {
    return { mode: 'full-body' };
  }

  return { mode: 'groups', groups: [...emphasis.groups] };
}

function copyDay(workoutDay: DraftWorkoutDay): DraftWorkoutDay {
  return {
    name: workoutDay.name,
    weekday: workoutDay.weekday,
    emphasis: copyEmphasis(workoutDay.emphasis),
  };
}

export const SPLIT_TEMPLATES: readonly SplitTemplate[] = [
  {
    id: 'full-body',
    name: 'Corpo inteiro',
    description:
      'O mesmo tipo de treino, com o corpo todo, três vezes na semana. Dá para tirar ou acrescentar dias depois.',
    days: [
      day('Corpo inteiro 1', 1, fullBody()),
      day('Corpo inteiro 2', 3, fullBody()),
      day('Corpo inteiro 3', 5, fullBody()),
    ],
  },
  {
    id: 'upper-lower',
    name: 'Superiores e inferiores',
    description:
      'Quatro treinos: superiores na segunda e na quinta, inferiores na terça e na sexta. Os dois dias de superiores são independentes.',
    days: [
      day('Superiores 1', 1, groups(UPPER_GROUPS)),
      day('Inferiores 1', 2, groups(LOWER_GROUPS)),
      day('Superiores 2', 4, groups(UPPER_GROUPS)),
      day('Inferiores 2', 5, groups(LOWER_GROUPS)),
    ],
  },
  {
    id: 'push-pull-legs',
    name: 'Push Pull Legs',
    description: 'Três treinos: push, pull e pernas, em dias alternados.',
    days: [
      day('Push', 1, groups(PUSH_GROUPS)),
      day('Pull', 3, groups(PULL_GROUPS)),
      day('Pernas', 5, groups(LOWER_GROUPS)),
    ],
  },
  {
    id: 'push-pull-legs-2x',
    name: 'Push Pull Legs 2x',
    description:
      'O ciclo push, pull e pernas repetido na semana. A segunda ocorrência de cada um começa igual e pode ser editada à parte.',
    days: [
      day('Push', 1, groups(PUSH_GROUPS)),
      day('Pull', 2, groups(PULL_GROUPS)),
      day('Pernas', 3, groups(LOWER_GROUPS)),
      day('Push 2', 4, groups(PUSH_GROUPS)),
      day('Pull 2', 5, groups(PULL_GROUPS)),
      day('Pernas 2', 6, groups(LOWER_GROUPS)),
    ],
  },
  {
    id: 'abc',
    name: 'ABC',
    description: 'Três treinos diferentes, A, B e C, em dias alternados.',
    days: [
      day('Treino A', 1, groups(PUSH_GROUPS)),
      day('Treino B', 3, groups(ABC_B_GROUPS)),
      day('Treino C', 5, groups(LOWER_GROUPS)),
    ],
  },
  {
    id: 'abc-2x',
    name: 'ABC 2x',
    description: 'A, B e C duas vezes na semana. O A da segunda vez é outro dia: pode ficar igual ou mudar.',
    days: [
      day('Treino A1', 1, groups(PUSH_GROUPS)),
      day('Treino B1', 2, groups(ABC_B_GROUPS)),
      day('Treino C1', 3, groups(LOWER_GROUPS)),
      day('Treino A2', 4, groups(PUSH_GROUPS)),
      day('Treino B2', 5, groups(ABC_B_GROUPS)),
      day('Treino C2', 6, groups(LOWER_GROUPS)),
    ],
  },
  {
    id: 'abcd',
    name: 'ABCD',
    description: 'Quatro treinos diferentes ao longo da semana.',
    days: [
      day('Treino A', 1, groups(ABCD_A_GROUPS)),
      day('Treino B', 2, groups(ABC_B_GROUPS)),
      day('Treino C', 4, groups(LOWER_GROUPS)),
      day('Treino D', 5, groups(ABCD_D_GROUPS)),
    ],
  },
  {
    id: 'abcde',
    name: 'ABCDE',
    description: 'Cinco treinos diferentes, um por dia útil, começando por peito, costas, pernas, ombros e braços.',
    days: [
      day('Treino A', 1, groups(['Peito'])),
      day('Treino B', 2, groups(['Costas'])),
      day('Treino C', 3, groups(LOWER_GROUPS)),
      day('Treino D', 4, groups(['Ombros'])),
      day('Treino E', 5, groups(ARMS_GROUPS)),
    ],
  },
  {
    id: 'custom',
    name: 'Personalizado',
    description: 'Começa com um dia, sem grupos sugeridos. Os outros dias e os grupos ficam por sua conta.',
    days: [day('Treino 1', 1, groups([]))],
  },
];

export function buildPlanDraft(templateId: SplitTemplateId): WorkoutPlanDraft {
  const template = SPLIT_TEMPLATES.find((item) => item.id === templateId);
  if (!template) {
    throw new Error(`Modelo desconhecido: ${templateId}`);
  }

  return {
    templateId: template.id,
    name: template.name,
    days: template.days.map(copyDay),
  };
}

export function freeWeekdays(days: readonly { weekday: Weekday }[]): Weekday[] {
  const used = new Set(days.map((workoutDay) => workoutDay.weekday));
  return WEEKDAYS.filter((weekday) => !used.has(weekday));
}

export function canAddWorkoutDay(days: readonly { weekday: Weekday }[]): boolean {
  return freeWeekdays(days).length > 0;
}

export function canRemoveWorkoutDay(days: readonly unknown[]): boolean {
  return days.length > 1;
}

function nextWorkoutDayName(days: readonly { name: string }[]): string {
  const names = new Set(days.map((workoutDay) => workoutDay.name));
  let index = 1;
  while (names.has(`Treino ${index}`)) {
    index += 1;
  }
  return `Treino ${index}`;
}

function byWeekday(left: DraftWorkoutDay, right: DraftWorkoutDay): number {
  return left.weekday - right.weekday;
}

export function addWorkoutDay(
  days: readonly DraftWorkoutDay[],
):
  | { ok: true; days: DraftWorkoutDay[]; added: DraftWorkoutDay }
  | { ok: false; reason: 'week-full'; days: readonly DraftWorkoutDay[] } {
  const weekday = freeWeekdays(days)[0];
  if (weekday === undefined) {
    return { ok: false, reason: 'week-full', days };
  }

  const added = day(nextWorkoutDayName(days), weekday, groups([]));
  return { ok: true, days: [...days.map(copyDay), added].sort(byWeekday), added };
}

export function removeWorkoutDay(
  days: readonly DraftWorkoutDay[],
  weekday: Weekday,
):
  | { ok: true; days: DraftWorkoutDay[] }
  | { ok: false; reason: 'last-day' | 'missing'; days: readonly DraftWorkoutDay[] } {
  if (!canRemoveWorkoutDay(days)) {
    return { ok: false, reason: 'last-day', days };
  }

  if (!days.some((workoutDay) => workoutDay.weekday === weekday)) {
    return { ok: false, reason: 'missing', days };
  }

  return {
    ok: true,
    days: days.filter((workoutDay) => workoutDay.weekday !== weekday).map(copyDay),
  };
}

export function moveWorkoutDay(
  days: readonly DraftWorkoutDay[],
  from: Weekday,
  to: Weekday,
):
  | { ok: true; days: DraftWorkoutDay[] }
  | { ok: false; reason: 'missing' | 'occupied'; days: readonly DraftWorkoutDay[] } {
  const source = days.find((workoutDay) => workoutDay.weekday === from);
  if (!source) {
    return { ok: false, reason: 'missing', days };
  }

  if (from === to || days.some((workoutDay) => workoutDay.weekday === to)) {
    return { ok: false, reason: 'occupied', days };
  }

  return {
    ok: true,
    days: days
      .map((workoutDay) => (workoutDay.weekday === from ? { ...copyDay(workoutDay), weekday: to } : copyDay(workoutDay)))
      .sort(byWeekday),
  };
}

const AGONIST_MIN_SCORE = 4;

export type ExerciseSelectorList = {
  exercises: CatalogExercise[];
  suggested: CatalogExercise[];
  others: CatalogExercise[];
  titled: boolean;
};

export function emphasisGroupIndex(
  exercise: CatalogExercise,
  muscleGroups: readonly MuscleGroupName[],
): number | null {
  let best: number | null = null;

  for (const row of exercise.recruitment) {
    if (row.recruitment < AGONIST_MIN_SCORE) {
      continue;
    }

    const index = muscleGroups.indexOf(row.groupName);
    if (index === -1) {
      continue;
    }

    if (best === null || index < best) {
      best = index;
    }
  }

  return best;
}

function kindRank(kind: ExerciseKind): number {
  return kind === 'compound' ? 0 : 1;
}

function compareNames(left: string, right: string): number {
  return left.localeCompare(right, 'pt-BR');
}

function compareExercises(left: CatalogExercise, right: CatalogExercise, emphasis: DayEmphasis): number {
  if (emphasis.mode === 'full-body') {
    return kindRank(left.kind) - kindRank(right.kind) || compareNames(left.name, right.name) || left.id.localeCompare(right.id);
  }

  if (emphasis.mode === 'groups' && emphasis.groups.length > 0) {
    const leftIndex = emphasisGroupIndex(left, emphasis.groups);
    const rightIndex = emphasisGroupIndex(right, emphasis.groups);
    const leftMatches = leftIndex !== null;
    const rightMatches = rightIndex !== null;

    if (leftMatches !== rightMatches) {
      return leftMatches ? -1 : 1;
    }

    if (leftMatches && rightMatches && leftIndex !== rightIndex) {
      return (leftIndex ?? 0) - (rightIndex ?? 0);
    }

    if (leftMatches && rightMatches) {
      const byKind = kindRank(left.kind) - kindRank(right.kind);
      if (byKind !== 0) {
        return byKind;
      }
    }

    return compareNames(left.name, right.name) || left.id.localeCompare(right.id);
  }

  return compareNames(left.name, right.name) || left.id.localeCompare(right.id);
}

export function listExercisesForDay(
  exercises: readonly CatalogExercise[],
  query: ExerciseQuery,
  emphasis: DayEmphasis,
): ExerciseSelectorList {
  const ordered = [...filterExercises(exercises, query)].sort((left, right) => compareExercises(left, right, emphasis));
  const usesGroups = emphasis.mode === 'groups' && emphasis.groups.length > 0;

  if (!usesGroups) {
    return { exercises: ordered, suggested: [], others: ordered, titled: false };
  }

  const suggested = ordered.filter((exercise) => emphasisGroupIndex(exercise, emphasis.groups) !== null);
  const others = ordered.filter((exercise) => emphasisGroupIndex(exercise, emphasis.groups) === null);

  return {
    exercises: ordered,
    suggested,
    others,
    titled: suggested.length > 0 && others.length > 0,
  };
}

export function visibleMuscleTags(
  rows: readonly { groupName: MuscleGroupName; recruitment: number }[],
): MuscleGroupName[] {
  const found = new Set<MuscleGroupName>();

  for (const row of rows) {
    if (row.recruitment >= AGONIST_MIN_SCORE) {
      found.add(row.groupName);
    }
  }

  return MUSCLE_GROUP_NAMES.filter((name) => found.has(name));
}

export type ExerciseTarget = {
  sets: number | null;
  repMin: number | null;
  repMax: number | null;
  weightKg: number | null;
};

export const EMPTY_EXERCISE_TARGET: ExerciseTarget = { sets: null, repMin: null, repMax: null, weightKg: null };

function isValidTargetCount(value: number | null): boolean {
  return value === null || (Number.isInteger(value) && value >= 1);
}

function isValidWeight(value: number | null): boolean {
  return value === null || (Number.isFinite(value) && value > 0);
}

export function applyExerciseTarget(
  current: ExerciseTarget,
  next: ExerciseTarget,
): { ok: true; target: ExerciseTarget } | { ok: false; target: ExerciseTarget } {
  if (
    !isValidTargetCount(next.sets) ||
    !isValidTargetCount(next.repMin) ||
    !isValidTargetCount(next.repMax) ||
    !isValidWeight(next.weightKg)
  ) {
    return { ok: false, target: current };
  }

  if (next.repMin !== null && next.repMax !== null && next.repMax < next.repMin) {
    return { ok: false, target: current };
  }

  return {
    ok: true,
    target: { sets: next.sets, repMin: next.repMin, repMax: next.repMax, weightKg: next.weightKg },
  };
}

export function confirmName(current: string, next: string): string {
  const trimmed = next.trim();
  return trimmed.length === 0 ? current : trimmed;
}

export type EmphasisChange =
  | { type: 'add-group'; group: MuscleGroupName }
  | { type: 'remove-group'; group: MuscleGroupName }
  | { type: 'remove-full-body' };

export function changeEmphasis(emphasis: DayEmphasis, change: EmphasisChange): DayEmphasis {
  if (change.type === 'add-group') {
    if (emphasis.mode === 'full-body') {
      return { mode: 'groups', groups: [change.group] };
    }

    if (emphasis.groups.includes(change.group)) {
      return copyEmphasis(emphasis);
    }

    return { mode: 'groups', groups: [...emphasis.groups, change.group] };
  }

  if (change.type === 'remove-group') {
    if (emphasis.mode === 'full-body') {
      return copyEmphasis(emphasis);
    }

    return { mode: 'groups', groups: emphasis.groups.filter((group) => group !== change.group) };
  }

  if (emphasis.mode === 'full-body') {
    return { mode: 'groups', groups: [] };
  }

  return copyEmphasis(emphasis);
}

export function allocateExercise(
  exerciseIds: readonly string[],
  exerciseId: string,
): { ok: true; exerciseIds: string[] } | { ok: false; reason: 'duplicate'; exerciseIds: readonly string[] } {
  if (exerciseIds.includes(exerciseId)) {
    return { ok: false, reason: 'duplicate', exerciseIds };
  }

  return { ok: true, exerciseIds: [...exerciseIds, exerciseId] };
}

export function moveExercise(
  exerciseIds: readonly string[],
  exerciseId: string,
  direction: 'up' | 'down',
): readonly string[] {
  const index = exerciseIds.indexOf(exerciseId);
  if (index < 0) {
    return exerciseIds;
  }

  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= exerciseIds.length) {
    return exerciseIds;
  }

  const next = [...exerciseIds];
  const [moved] = next.splice(index, 1);
  if (moved === undefined) {
    return exerciseIds;
  }

  next.splice(target, 0, moved);
  return next;
}
