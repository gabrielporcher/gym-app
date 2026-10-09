import { and, asc, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { exerciseAliases, exerciseMuscles, exercises, muscleGroups, muscles } from '@/db/schema';
import type {
  CatalogExercise,
  CatalogMuscle,
  CatalogMuscleGroup,
  EquipmentName,
  ExerciseKind,
  LoadTypeName,
  MuscleGroupName,
  RecruitmentScore,
} from '@/domain/exercise-catalog';

const EQUIPMENT_LABEL: Record<
  'barbell' | 'ez-bar' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'smith' | 'trap-bar',
  EquipmentName
> = {
  barbell: 'Barra',
  'ez-bar': 'Barra W',
  dumbbell: 'Halteres',
  machine: 'Máquina',
  cable: 'Cabo',
  bodyweight: 'Peso corporal',
  smith: 'Smith',
  'trap-bar': 'Barra hexagonal',
};

const LOAD_TYPE_LABEL: Record<'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable', LoadTypeName> =
  {
    barbell: 'barra',
    dumbbell: 'halter',
    machine: 'máquina',
    bodyweight: 'peso corporal',
    cable: 'cabo',
  };

export async function listMuscleGroups(): Promise<CatalogMuscleGroup[]> {
  const rows = await db
    .select()
    .from(muscleGroups)
    .where(isNull(muscleGroups.deletedAt))
    .orderBy(asc(muscleGroups.sortOrder));

  return rows.map((row) => ({
    id: row.id,
    name: row.name as MuscleGroupName,
    sortOrder: row.sortOrder,
  }));
}

export async function listMuscles(): Promise<CatalogMuscle[]> {
  const groups = await listMuscleGroups();
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const rows = await db.select().from(muscles).where(isNull(muscles.deletedAt));

  return rows
    .flatMap((row) => {
      const group = groupById.get(row.muscleGroupId);
      if (!group) {
        return [];
      }

      return [
        {
          id: row.id,
          name: row.name,
          groupId: group.id,
          groupName: group.name,
          sortOrder: row.sortOrder,
        },
      ];
    })
    .sort((left, right) => {
      const leftGroup = groupById.get(left.groupId)?.sortOrder ?? 0;
      const rightGroup = groupById.get(right.groupId)?.sortOrder ?? 0;
      return leftGroup - rightGroup || left.sortOrder - right.sortOrder;
    });
}

export async function listExercises(): Promise<CatalogExercise[]> {
  const [groups, muscleRows, exerciseRows, aliasRows, recruitmentRows] = await Promise.all([
    listMuscleGroups(),
    db.select().from(muscles).where(isNull(muscles.deletedAt)),
    db
      .select()
      .from(exercises)
      .where(and(isNull(exercises.deletedAt), isNull(exercises.ownerId))),
    db.select().from(exerciseAliases).where(isNull(exerciseAliases.deletedAt)),
    db.select().from(exerciseMuscles).where(isNull(exerciseMuscles.deletedAt)),
  ]);

  const groupById = new Map(groups.map((group) => [group.id, group]));
  const muscleById = new Map(
    muscleRows.flatMap((row) => {
      const group = groupById.get(row.muscleGroupId);
      if (!group) {
        return [];
      }
      return [[row.id, { name: row.name, groupName: group.name }] as const];
    }),
  );

  const aliasesByExercise = new Map<string, string[]>();
  for (const row of aliasRows) {
    const current = aliasesByExercise.get(row.exerciseId) ?? [];
    current.push(row.alias);
    aliasesByExercise.set(row.exerciseId, current);
  }

  const recruitmentByExercise = new Map<string, CatalogExercise['recruitment'][number][]>();
  for (const row of recruitmentRows) {
    const muscle = muscleById.get(row.muscleId);
    if (!muscle) {
      continue;
    }

    const current = recruitmentByExercise.get(row.exerciseId) ?? [];
    current.push({
      muscleId: row.muscleId,
      muscleName: muscle.name,
      groupName: muscle.groupName,
      recruitment: asRecruitmentScore(row.recruitment),
    });
    recruitmentByExercise.set(row.exerciseId, current);
  }

  return exerciseRows.map((row) => ({
    id: row.id,
    name: row.name,
    aliases: aliasesByExercise.get(row.id) ?? [],
    equipment: EQUIPMENT_LABEL[row.equipment],
    loadType: LOAD_TYPE_LABEL[row.loadType],
    kind: row.kind as ExerciseKind,
    unilateral: row.unilateral,
    recruitment: recruitmentByExercise.get(row.id) ?? [],
  }));
}

function asRecruitmentScore(value: number): RecruitmentScore {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5) {
    return value;
  }

  throw new Error(`Recrutamento fora da escala: ${value}`);
}
