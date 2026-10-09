export const MUSCLE_GROUP_NAMES = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Antebraço',
  'Quadríceps',
  'Posterior de coxa',
  'Glúteos',
  'Adutores',
  'Panturrilhas',
  'Abdômen',
] as const;

export const EQUIPMENT_NAMES = [
  'Barra',
  'Barra W',
  'Halteres',
  'Máquina',
  'Cabo',
  'Peso corporal',
  'Smith',
  'Barra hexagonal',
] as const;

export const LOAD_TYPE_NAMES = ['barra', 'halter', 'máquina', 'peso corporal', 'cabo'] as const;

export type MuscleGroupName = (typeof MUSCLE_GROUP_NAMES)[number];
export type EquipmentName = (typeof EQUIPMENT_NAMES)[number];
export type LoadTypeName = (typeof LOAD_TYPE_NAMES)[number];
export type ExerciseKind = 'compound' | 'isolation';
export type RecruitmentScore = 1 | 2 | 3 | 4 | 5;
export type RecruitmentRole = 'primary-agonist' | 'secondary-agonist' | 'synergist';

export type CatalogMuscleGroup = {
  id: string;
  name: MuscleGroupName;
  sortOrder: number;
};

export type CatalogMuscle = {
  id: string;
  name: string;
  groupId: string;
  groupName: MuscleGroupName;
  sortOrder: number;
};

export type CatalogMuscleRecruitment = {
  muscleId: string;
  muscleName: string;
  groupName: MuscleGroupName;
  recruitment: RecruitmentScore;
};

export type CatalogExercise = {
  id: string;
  name: string;
  aliases: readonly string[];
  equipment: EquipmentName;
  loadType: LoadTypeName;
  kind: ExerciseKind;
  unilateral: boolean;
  recruitment: readonly CatalogMuscleRecruitment[];
  removed?: boolean;
};

export type ExerciseQuery = {
  text?: string;
  muscleGroup?: string;
  equipment?: string;
};

const AGONIST_MIN_SCORE = 4;

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

export function recruitmentRole(score: number | null | undefined): RecruitmentRole | null {
  if (score === 5) {
    return 'primary-agonist';
  }

  if (score === 4) {
    return 'secondary-agonist';
  }

  if (score === 1 || score === 2 || score === 3) {
    return 'synergist';
  }

  return null;
}

export function recruitmentScore(
  exercise: CatalogExercise,
  muscleName: string,
): RecruitmentScore | undefined {
  return exercise.recruitment.find((row) => row.muscleName === muscleName)?.recruitment;
}

export function findExerciseById(
  exercises: readonly CatalogExercise[],
  id: string,
): CatalogExercise | undefined {
  return exercises.find((exercise) => exercise.id === id && !exercise.removed);
}

export function filterExercises(
  exercises: readonly CatalogExercise[],
  query: ExerciseQuery = {},
): CatalogExercise[] {
  const text = normalizeSearchText(query.text ?? '');
  const muscleGroup = normalizeSearchText(query.muscleGroup ?? '');
  const equipment = normalizeSearchText(query.equipment ?? '');

  if (muscleGroup && !isKnownName(MUSCLE_GROUP_NAMES, muscleGroup)) {
    return [];
  }

  if (equipment && !isKnownName(EQUIPMENT_NAMES, equipment)) {
    return [];
  }

  const matches = new Map<string, CatalogExercise>();

  for (const exercise of exercises) {
    if (exercise.removed || matches.has(exercise.id)) {
      continue;
    }

    if (text && !matchesText(exercise, text)) {
      continue;
    }

    if (muscleGroup && !matchesMuscleGroup(exercise, muscleGroup)) {
      continue;
    }

    if (equipment && normalizeSearchText(exercise.equipment) !== equipment) {
      continue;
    }

    matches.set(exercise.id, exercise);
  }

  return [...matches.values()].sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function isKnownName(names: readonly string[], normalized: string): boolean {
  return names.some((name) => normalizeSearchText(name) === normalized);
}

function matchesText(exercise: CatalogExercise, text: string): boolean {
  if (normalizeSearchText(exercise.name).includes(text)) {
    return true;
  }

  return exercise.aliases.some((alias) => normalizeSearchText(alias).includes(text));
}

function matchesMuscleGroup(exercise: CatalogExercise, muscleGroup: string): boolean {
  const highest = exercise.recruitment.reduce((max, row) => {
    if (normalizeSearchText(row.groupName) !== muscleGroup) {
      return max;
    }

    return Math.max(max, row.recruitment);
  }, 0);

  return highest >= AGONIST_MIN_SCORE;
}
