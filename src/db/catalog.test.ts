import {
  EQUIPMENT_NAMES,
  LOAD_TYPE_NAMES,
  MUSCLE_GROUP_NAMES,
  filterExercises,
  type CatalogExercise,
  type EquipmentName,
  type LoadTypeName,
  type MuscleGroupName,
} from '@/domain/exercise-catalog';

import {
  catalogExercises,
  catalogMuscleGroups,
  catalogMuscles,
  type CatalogSeedExercise,
  type EquipmentCode,
  type LoadTypeCode,
} from './catalog';
import seedSql from './migrations/0001_seed_exercise_catalog.sql';

const EQUIPMENT_LABEL: Record<EquipmentCode, EquipmentName> = {
  barbell: 'Barra',
  'ez-bar': 'Barra W',
  dumbbell: 'Halteres',
  machine: 'Máquina',
  cable: 'Cabo',
  bodyweight: 'Peso corporal',
  smith: 'Smith',
  'trap-bar': 'Barra hexagonal',
};

const LOAD_TYPE_LABEL: Record<LoadTypeCode, LoadTypeName> = {
  barbell: 'barra',
  dumbbell: 'halter',
  machine: 'máquina',
  bodyweight: 'peso corporal',
  cable: 'cabo',
};

const MUSCLES_BY_GROUP: Record<MuscleGroupName, readonly string[]> = {
  Peito: ['Peitoral superior', 'Peitoral médio-inferior'],
  Costas: [
    'Latíssimo do dorso',
    'Romboides',
    'Trapézio superior',
    'Trapézio médio',
    'Trapézio inferior',
    'Eretor da espinha',
  ],
  Ombros: ['Deltoide anterior', 'Deltoide lateral', 'Deltoide posterior'],
  Bíceps: ['Bíceps braquial', 'Braquial'],
  Tríceps: ['Tríceps cabeça longa', 'Tríceps cabeça lateral', 'Tríceps cabeça medial'],
  Antebraço: ['Braquiorradial', 'Flexores do punho', 'Extensores do punho'],
  Quadríceps: ['Reto femoral', 'Vastos do quadríceps'],
  'Posterior de coxa': ['Bíceps femoral', 'Semitendíneo e semimembranoso'],
  Glúteos: ['Glúteo máximo', 'Glúteo médio'],
  Adutores: ['Adutores'],
  Panturrilhas: ['Gastrocnêmio', 'Sóleo'],
  Abdômen: ['Reto abdominal', 'Oblíquos'],
};

function groupName(muscleGroupId: string): MuscleGroupName {
  const name = catalogMuscleGroups.find((group) => group.id === muscleGroupId)?.name;
  if (!name || !(MUSCLE_GROUP_NAMES as readonly string[]).includes(name)) {
    throw new Error(`Grupo desconhecido: ${name}`);
  }
  return name as MuscleGroupName;
}

function toDomain(seed: CatalogSeedExercise): CatalogExercise {
  return {
    id: seed.id,
    name: seed.name,
    aliases: seed.aliases.map((alias) => alias.alias),
    equipment: EQUIPMENT_LABEL[seed.equipment],
    loadType: LOAD_TYPE_LABEL[seed.loadType],
    kind: seed.kind,
    unilateral: seed.unilateral,
    recruitment: seed.recruitment.map((row) => {
      const muscle = catalogMuscles.find((item) => item.id === row.muscleId);
      if (!muscle) {
        throw new Error(`Músculo ausente em ${seed.name}`);
      }
      return {
        muscleId: muscle.id,
        muscleName: muscle.name,
        groupName: groupName(muscle.muscleGroupId),
        recruitment: row.recruitment,
      };
    }),
  };
}

const domainExercises = catalogExercises.map(toDomain);

function scoresOf(name: string): Record<string, number> {
  const exercise = domainExercises.find((item) => item.name === name);
  if (!exercise) {
    throw new Error(name);
  }
  return Object.fromEntries(exercise.recruitment.map((row) => [row.muscleName, row.recruitment]));
}

test('catálogo tem os 114 nomes, a taxonomia fechada e notas de 2 a 5 com um 5', () => {
  expect(catalogExercises).toHaveLength(114);
  expect(new Set(catalogExercises.map((exercise) => exercise.name)).size).toBe(114);
  expect(catalogMuscleGroups.map((group) => group.name)).toEqual([...MUSCLE_GROUP_NAMES]);
  for (const absent of ['Braços', 'Pernas', 'Lombar', 'Cardio']) {
    expect(catalogMuscleGroups.map((group) => group.name)).not.toContain(absent);
  }

  for (const groupName of MUSCLE_GROUP_NAMES) {
    const group = catalogMuscleGroups.find((item) => item.name === groupName);
    const muscles = catalogMuscles
      .filter((muscle) => muscle.muscleGroupId === group?.id)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((muscle) => muscle.name);
    expect(muscles).toEqual([...MUSCLES_BY_GROUP[groupName]]);
  }

  expect(new Set(catalogMuscles.map((muscle) => muscle.name)).size).toBe(catalogMuscles.length);

  for (const exercise of catalogExercises) {
    expect(exercise.ownerId).toBeNull();
    expect(EQUIPMENT_NAMES).toContain(EQUIPMENT_LABEL[exercise.equipment]);
    expect(LOAD_TYPE_NAMES).toContain(LOAD_TYPE_LABEL[exercise.loadType]);
    expect(exercise.recruitment.some((row) => row.recruitment === 5)).toBe(true);
    for (const row of exercise.recruitment) {
      expect(row.recruitment).toBeGreaterThanOrEqual(2);
      expect(row.recruitment).toBeLessThanOrEqual(5);
      expect(row.recruitment).not.toBe(0);
    }
  }

  const equipmentLabels = catalogExercises.map((exercise) => EQUIPMENT_LABEL[exercise.equipment]);
  expect(equipmentLabels).not.toContain('Kettlebell');
  expect(equipmentLabels).not.toContain('Elástico');
});

test('Barra W, Smith e barra hexagonal usam carga barra', () => {
  const byName = Object.fromEntries(catalogExercises.map((exercise) => [exercise.name, exercise]));
  expect(byName['Rosca direta com barra W']).toMatchObject({ equipment: 'ez-bar', loadType: 'barbell' });
  expect(byName['Agachamento no Smith']).toMatchObject({ equipment: 'smith', loadType: 'barbell' });
  expect(byName['Levantamento terra com barra hexagonal']).toMatchObject({
    equipment: 'trap-bar',
    loadType: 'barbell',
  });

  for (const exercise of catalogExercises) {
    if (exercise.equipment === 'ez-bar' || exercise.equipment === 'smith' || exercise.equipment === 'trap-bar') {
      expect(exercise.loadType).toBe('barbell');
    }
  }
});

test('recrutamentos pinados de supino, agachamento e tríceps testa', () => {
  expect(scoresOf('Supino reto com barra')).toEqual({
    'Peitoral médio-inferior': 5,
    'Peitoral superior': 3,
    'Deltoide anterior': 3,
    'Tríceps cabeça lateral': 3,
    'Tríceps cabeça medial': 3,
    'Tríceps cabeça longa': 2,
  });
  expect(scoresOf('Supino inclinado com barra')).toEqual({
    'Peitoral superior': 5,
    'Peitoral médio-inferior': 3,
    'Deltoide anterior': 4,
    'Tríceps cabeça lateral': 3,
    'Tríceps cabeça medial': 3,
    'Tríceps cabeça longa': 2,
  });
  expect(scoresOf('Agachamento livre')).toEqual({
    'Vastos do quadríceps': 5,
    'Glúteo máximo': 4,
    'Reto femoral': 3,
    'Eretor da espinha': 3,
    'Bíceps femoral': 2,
    'Semitendíneo e semimembranoso': 2,
  });
  expect(scoresOf('Tríceps testa com barra W')).toEqual({
    'Tríceps cabeça longa': 5,
    'Tríceps cabeça lateral': 4,
    'Tríceps cabeça medial': 3,
  });
  expect(scoresOf('Tríceps testa com barra W')['Peitoral médio-inferior']).toBeUndefined();
});

test('filterExercises no catálogo cobre grupo, texto e ausência', () => {
  const names = (query: Parameters<typeof filterExercises>[1]) =>
    filterExercises(domainExercises, query).map((exercise) => exercise.name);

  expect(names({ muscleGroup: 'Peito' })).toContain('Supino reto com barra');
  expect(names({ muscleGroup: 'Tríceps' })).not.toContain('Supino reto com barra');
  expect(names({ muscleGroup: 'Tríceps' })).toContain('Tríceps testa com barra W');
  expect(names({ muscleGroup: 'Ombros' })).toContain('Supino inclinado com barra');
  expect(names({ muscleGroup: 'Glúteos' })).toContain('Agachamento livre');
  expect(names({ muscleGroup: 'Glúteos' })).not.toContain('Cadeira extensora');
  expect(names({ text: 'voador' }).filter((name) => name === 'Voador')).toEqual(['Voador']);
  expect(names({ text: 'triceps' })).toContain('Tríceps testa com barra W');
  expect(names({ text: 'burpee' })).toEqual([]);
});

test('cada UUID do catálogo aparece no INSERT e nenhum id se repete', () => {
  expect(seedSql.trim()).not.toBe('');
  expect(seedSql).toContain('INSERT INTO');

  const ids = [
    ...catalogMuscleGroups.map((group) => group.id),
    ...catalogMuscles.map((muscle) => muscle.id),
    ...catalogExercises.flatMap((exercise) => [
      exercise.id,
      ...exercise.aliases.map((alias) => alias.id),
      ...exercise.recruitment.map((row) => row.id),
    ]),
  ];
  expect(new Set(ids).size).toBe(ids.length);

  const expected = new Map<string, number>();

  function expectId(id: string, count: number) {
    expected.set(id, (expected.get(id) ?? 0) + count);
  }

  for (const group of catalogMuscleGroups) {
    const musclesInGroup = catalogMuscles.filter((muscle) => muscle.muscleGroupId === group.id).length;
    expectId(group.id, 1 + musclesInGroup);
  }

  for (const muscle of catalogMuscles) {
    const references = catalogExercises.reduce(
      (total, exercise) =>
        total + exercise.recruitment.filter((row) => row.muscleId === muscle.id).length,
      0,
    );
    expectId(muscle.id, 1 + references);
  }

  for (const exercise of catalogExercises) {
    expectId(exercise.id, 1 + exercise.aliases.length + exercise.recruitment.length);
    for (const alias of exercise.aliases) {
      expectId(alias.id, 1);
    }
    for (const row of exercise.recruitment) {
      expectId(row.id, 1);
    }
  }

  expect(ids).toHaveLength(expected.size);
  for (const [id, count] of expected) {
    expect(seedSql.split(id).length - 1).toBe(count);
  }
});
