import { and, asc, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  exercises,
  localOwner,
  muscleGroups,
  plannedExercises,
  workoutDayMuscles,
  workoutDays,
  workoutPlans,
} from '@/db/schema';
import { MUSCLE_GROUP_NAMES, type MuscleGroupName } from '@/domain/exercise-catalog';
import {
  addWorkoutDay,
  allocateExercise,
  applyExerciseTarget,
  buildPlanDraft,
  changeEmphasis,
  confirmName,
  moveExercise,
  moveWorkoutDay,
  removeWorkoutDay,
  SPLIT_TEMPLATE_IDS,
  type DayEmphasis,
  type DraftWorkoutDay,
  type EmphasisChange,
  type ExerciseTarget,
  type SplitTemplateId,
  type Weekday,
} from '@/domain/workout-plan';

const LOCAL_OWNER_ROW_ID = 'local';

type Database = typeof db;
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export type WorkoutPlanStatus = 'active' | 'archived';

export type WorkoutDaySummary = {
  id: string;
  name: string;
  weekday: Weekday;
};

export type WorkoutPlanSummary = {
  id: string;
  name: string;
  status: WorkoutPlanStatus;
  days: WorkoutDaySummary[];
};

export type PlannedExerciseDetails = {
  id: string;
  exerciseId: string;
  name: string;
  sortOrder: number;
  target: ExerciseTarget;
};

export type WorkoutDayDetails = {
  id: string;
  planId: string;
  name: string;
  weekday: Weekday;
  emphasis: DayEmphasis;
  exercises: PlannedExerciseDetails[];
};

export type WorkoutPlanDetails = {
  id: string;
  name: string;
  templateId: SplitTemplateId;
  status: WorkoutPlanStatus;
  days: WorkoutDayDetails[];
};

type StoredDay = {
  id: string;
  planId: string;
  ownerId: string;
  name: string;
  weekday: Weekday;
  emphasis: DayEmphasis;
};

function createId(): string {
  return globalThis.crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function run<T>(work: (tx: Transaction) => T): T {
  return db.transaction(work);
}

function asWeekday(value: number): Weekday {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6 || value === 7) {
    return value;
  }

  throw new Error(`Dia da semana inválido: ${value}`);
}

function asTemplateId(value: string): SplitTemplateId {
  const match = SPLIT_TEMPLATE_IDS.find((id) => id === value);
  if (!match) {
    throw new Error(`Modelo desconhecido: ${value}`);
  }

  return match;
}

function asStatus(value: string): WorkoutPlanStatus {
  if (value === 'active' || value === 'archived') {
    return value;
  }

  throw new Error(`Estado de plano inválido: ${value}`);
}

function asMuscleGroupName(value: string): MuscleGroupName {
  const match = MUSCLE_GROUP_NAMES.find((name) => name === value);
  if (!match) {
    throw new Error(`Grupo desconhecido: ${value}`);
  }

  return match;
}

function ensureOwner(tx: Transaction): string {
  const existing = tx.select().from(localOwner).where(eq(localOwner.id, LOCAL_OWNER_ROW_ID)).all();
  const row = existing[0];
  if (row) {
    return row.ownerId;
  }

  const ownerId = createId();
  tx.insert(localOwner)
    .values({ id: LOCAL_OWNER_ROW_ID, ownerId, createdAt: now() })
    .run();
  return ownerId;
}

function findPlan(tx: Transaction, planId: string) {
  return (
    tx
      .select()
      .from(workoutPlans)
      .where(and(eq(workoutPlans.id, planId), isNull(workoutPlans.deletedAt)))
      .all()[0] ?? null
  );
}

function findActivePlan(tx: Transaction, ownerId: string) {
  return (
    tx
      .select()
      .from(workoutPlans)
      .where(
        and(eq(workoutPlans.ownerId, ownerId), eq(workoutPlans.status, 'active'), isNull(workoutPlans.deletedAt)),
      )
      .all()[0] ?? null
  );
}

function muscleGroupIdByName(tx: Transaction): Map<MuscleGroupName, string> {
  const rows = tx.select().from(muscleGroups).where(isNull(muscleGroups.deletedAt)).all();
  return new Map(rows.map((row) => [asMuscleGroupName(row.name), row.id]));
}

function loadStoredDays(tx: Transaction, planId: string): StoredDay[] {
  const dayRows = tx
    .select()
    .from(workoutDays)
    .where(and(eq(workoutDays.planId, planId), isNull(workoutDays.deletedAt)))
    .orderBy(asc(workoutDays.weekday))
    .all();
  const dayIds = dayRows.map((row) => row.id);
  const muscleRows =
    dayIds.length === 0
      ? []
      : tx
          .select({
            workoutDayId: workoutDayMuscles.workoutDayId,
            sortOrder: workoutDayMuscles.sortOrder,
            groupName: muscleGroups.name,
          })
          .from(workoutDayMuscles)
          .innerJoin(muscleGroups, eq(workoutDayMuscles.muscleGroupId, muscleGroups.id))
          .where(
            and(
              inArray(workoutDayMuscles.workoutDayId, dayIds),
              isNull(workoutDayMuscles.deletedAt),
              isNull(muscleGroups.deletedAt),
            ),
          )
          .all();

  const groupsByDay = new Map<string, { sortOrder: number; groupName: MuscleGroupName }[]>();
  for (const row of muscleRows) {
    const current = groupsByDay.get(row.workoutDayId) ?? [];
    current.push({ sortOrder: row.sortOrder, groupName: asMuscleGroupName(row.groupName) });
    groupsByDay.set(row.workoutDayId, current);
  }

  return dayRows.map((row) => {
    const weekday = asWeekday(row.weekday);
    if (row.emphasis === 'full-body') {
      return {
        id: row.id,
        planId: row.planId,
        ownerId: row.ownerId,
        name: row.name,
        weekday,
        emphasis: { mode: 'full-body' },
      };
    }

    const groups = (groupsByDay.get(row.id) ?? [])
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((group) => group.groupName);

    return {
      id: row.id,
      planId: row.planId,
      ownerId: row.ownerId,
      name: row.name,
      weekday,
      emphasis: { mode: 'groups', groups },
    };
  });
}

function loadExercises(tx: Transaction, dayIds: readonly string[]): Map<string, PlannedExerciseDetails[]> {
  const byDay = new Map<string, PlannedExerciseDetails[]>();
  if (dayIds.length === 0) {
    return byDay;
  }

  const rows = tx
    .select({
      id: plannedExercises.id,
      workoutDayId: plannedExercises.workoutDayId,
      exerciseId: plannedExercises.exerciseId,
      sortOrder: plannedExercises.sortOrder,
      targetSets: plannedExercises.targetSets,
      targetRepMin: plannedExercises.targetRepMin,
      targetRepMax: plannedExercises.targetRepMax,
      name: exercises.name,
    })
    .from(plannedExercises)
    .innerJoin(exercises, eq(plannedExercises.exerciseId, exercises.id))
    .where(
      and(
        inArray(plannedExercises.workoutDayId, [...dayIds]),
        isNull(plannedExercises.deletedAt),
        isNull(exercises.deletedAt),
      ),
    )
    .orderBy(asc(plannedExercises.sortOrder))
    .all();

  for (const row of rows) {
    const current = byDay.get(row.workoutDayId) ?? [];
    current.push({
      id: row.id,
      exerciseId: row.exerciseId,
      name: row.name,
      sortOrder: row.sortOrder,
      target: { sets: row.targetSets, repMin: row.targetRepMin, repMax: row.targetRepMax },
    });
    byDay.set(row.workoutDayId, current);
  }

  return byDay;
}

function toDetails(tx: Transaction, plan: NonNullable<ReturnType<typeof findPlan>>): WorkoutPlanDetails {
  const stored = loadStoredDays(tx, plan.id);
  const exercisesByDay = loadExercises(
    tx,
    stored.map((day) => day.id),
  );

  return {
    id: plan.id,
    name: plan.name,
    templateId: asTemplateId(plan.templateId),
    status: asStatus(plan.status),
    days: stored.map((day) => ({
      id: day.id,
      planId: day.planId,
      name: day.name,
      weekday: day.weekday,
      emphasis: day.emphasis,
      exercises: exercisesByDay.get(day.id) ?? [],
    })),
  };
}

function insertDay(
  tx: Transaction,
  input: {
    planId: string;
    ownerId: string;
    draft: DraftWorkoutDay;
    groupIds: Map<MuscleGroupName, string>;
    timestamp: string;
  },
): string {
  const dayId = createId();
  tx.insert(workoutDays)
    .values({
      id: dayId,
      planId: input.planId,
      ownerId: input.ownerId,
      name: input.draft.name,
      weekday: input.draft.weekday,
      emphasis: input.draft.emphasis.mode,
      createdAt: input.timestamp,
      updatedAt: input.timestamp,
      deletedAt: null,
    })
    .run();

  if (input.draft.emphasis.mode === 'groups') {
    input.draft.emphasis.groups.forEach((group, index) => {
      const muscleGroupId = input.groupIds.get(group);
      if (!muscleGroupId) {
        throw new Error(`Grupo sem id: ${group}`);
      }

      tx.insert(workoutDayMuscles)
        .values({
          id: createId(),
          workoutDayId: dayId,
          ownerId: input.ownerId,
          muscleGroupId,
          sortOrder: index,
          createdAt: input.timestamp,
          updatedAt: input.timestamp,
          deletedAt: null,
        })
        .run();
    });
  }

  return dayId;
}

function persistEmphasis(tx: Transaction, day: StoredDay, emphasis: DayEmphasis): void {
  const timestamp = now();
  tx.update(workoutDays)
    .set({ emphasis: emphasis.mode, updatedAt: timestamp })
    .where(eq(workoutDays.id, day.id))
    .run();
  tx.update(workoutDayMuscles)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(and(eq(workoutDayMuscles.workoutDayId, day.id), isNull(workoutDayMuscles.deletedAt)))
    .run();

  if (emphasis.mode === 'full-body') {
    return;
  }

  const groupIds = muscleGroupIdByName(tx);
  emphasis.groups.forEach((group, index) => {
    const muscleGroupId = groupIds.get(group);
    if (!muscleGroupId) {
      throw new Error(`Grupo sem id: ${group}`);
    }

    tx.insert(workoutDayMuscles)
      .values({
        id: createId(),
        workoutDayId: day.id,
        ownerId: day.ownerId,
        muscleGroupId,
        sortOrder: index,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();
  });
}

function softDeleteDay(tx: Transaction, dayId: string): void {
  const timestamp = now();
  tx.update(workoutDayMuscles)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(and(eq(workoutDayMuscles.workoutDayId, dayId), isNull(workoutDayMuscles.deletedAt)))
    .run();
  tx.update(plannedExercises)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(and(eq(plannedExercises.workoutDayId, dayId), isNull(plannedExercises.deletedAt)))
    .run();
  tx.update(workoutDays)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(and(eq(workoutDays.id, dayId), isNull(workoutDays.deletedAt)))
    .run();
}

function findStoredDay(tx: Transaction, planId: string, dayId: string): StoredDay | null {
  return loadStoredDays(tx, planId).find((day) => day.id === dayId) ?? null;
}

export async function createWorkoutPlan(
  templateId: SplitTemplateId,
  options?: { archiveActive?: boolean },
): Promise<{ ok: true; planId: string } | { ok: false; reason: 'active-exists' }> {
  const draft = buildPlanDraft(templateId);

  return run((tx) => {
    const ownerId = ensureOwner(tx);
    const active = findActivePlan(tx, ownerId);
    if (active && !options?.archiveActive) {
      return { ok: false, reason: 'active-exists' };
    }

    const timestamp = now();
    if (active) {
      tx.update(workoutPlans)
        .set({ status: 'archived', updatedAt: timestamp })
        .where(eq(workoutPlans.id, active.id))
        .run();
    }

    const planId = createId();
    tx.insert(workoutPlans)
      .values({
        id: planId,
        ownerId,
        name: draft.name,
        templateId: draft.templateId,
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();

    const groupIds = muscleGroupIdByName(tx);
    for (const workoutDay of draft.days) {
      insertDay(tx, { planId, ownerId, draft: workoutDay, groupIds, timestamp });
    }

    return { ok: true, planId };
  });
}

export async function listWorkoutPlans(): Promise<{
  active: WorkoutPlanSummary | null;
  archived: WorkoutPlanSummary[];
}> {
  return run((tx) => {
    const plans = tx.select().from(workoutPlans).where(isNull(workoutPlans.deletedAt)).all();
    if (plans.length === 0) {
      return { active: null, archived: [] };
    }

    const days = tx
      .select()
      .from(workoutDays)
      .where(
        and(
          inArray(
            workoutDays.planId,
            plans.map((plan) => plan.id),
          ),
          isNull(workoutDays.deletedAt),
        ),
      )
      .orderBy(asc(workoutDays.weekday))
      .all();
    const daysByPlan = new Map<string, WorkoutDaySummary[]>();
    for (const day of days) {
      const current = daysByPlan.get(day.planId) ?? [];
      current.push({ id: day.id, name: day.name, weekday: asWeekday(day.weekday) });
      daysByPlan.set(day.planId, current);
    }

    const summaries = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      status: asStatus(plan.status),
      updatedAt: plan.updatedAt,
      days: daysByPlan.get(plan.id) ?? [],
    }));
    const active = summaries.find((plan) => plan.status === 'active') ?? null;
    const archived = summaries
      .filter((plan) => plan.status === 'archived')
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map(({ updatedAt: _updatedAt, ...plan }) => plan);

    return {
      active: active ? { id: active.id, name: active.name, status: active.status, days: active.days } : null,
      archived,
    };
  });
}

export async function getWorkoutPlan(planId: string): Promise<WorkoutPlanDetails | null> {
  return run((tx) => {
    const plan = findPlan(tx, planId);
    return plan ? toDetails(tx, plan) : null;
  });
}

export async function getWorkoutDay(planId: string, dayId: string): Promise<WorkoutDayDetails | null> {
  return run((tx) => {
    const plan = findPlan(tx, planId);
    if (!plan) {
      return null;
    }

    const details = toDetails(tx, plan);
    return details.days.find((day) => day.id === dayId) ?? null;
  });
}

export async function reactivateWorkoutPlan(planId: string): Promise<void> {
  run((tx) => {
    const plan = findPlan(tx, planId);
    if (!plan || plan.status === 'active') {
      return;
    }

    const timestamp = now();
    const active = findActivePlan(tx, plan.ownerId);
    if (active) {
      tx.update(workoutPlans)
        .set({ status: 'archived', updatedAt: timestamp })
        .where(eq(workoutPlans.id, active.id))
        .run();
    }

    tx.update(workoutPlans).set({ status: 'active', updatedAt: timestamp }).where(eq(workoutPlans.id, planId)).run();
  });
}

export async function deleteWorkoutPlan(planId: string): Promise<void> {
  run((tx) => {
    const plan = findPlan(tx, planId);
    if (!plan) {
      return;
    }

    const timestamp = now();
    for (const day of loadStoredDays(tx, planId)) {
      softDeleteDay(tx, day.id);
    }

    tx.update(workoutPlans)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(eq(workoutPlans.id, planId))
      .run();
  });
}

export async function renameWorkoutPlan(planId: string, name: string): Promise<void> {
  run((tx) => {
    const plan = findPlan(tx, planId);
    if (!plan) {
      return;
    }

    const next = confirmName(plan.name, name);
    if (next === plan.name) {
      return;
    }

    tx.update(workoutPlans).set({ name: next, updatedAt: now() }).where(eq(workoutPlans.id, planId)).run();
  });
}

export async function renameWorkoutDay(planId: string, dayId: string, name: string): Promise<void> {
  run((tx) => {
    const day = findStoredDay(tx, planId, dayId);
    if (!day) {
      return;
    }

    const next = confirmName(day.name, name);
    if (next === day.name) {
      return;
    }

    tx.update(workoutDays).set({ name: next, updatedAt: now() }).where(eq(workoutDays.id, dayId)).run();
  });
}

export async function addDayToPlan(
  planId: string,
): Promise<{ ok: true; dayId: string } | { ok: false; reason: 'week-full' | 'missing-plan' }> {
  return run((tx) => {
    const plan = findPlan(tx, planId);
    if (!plan) {
      return { ok: false, reason: 'missing-plan' };
    }

    const stored = loadStoredDays(tx, planId);
    const added = addWorkoutDay(stored.map((day) => ({ name: day.name, weekday: day.weekday, emphasis: day.emphasis })));
    if (!added.ok) {
      return { ok: false, reason: added.reason };
    }

    const dayId = insertDay(tx, {
      planId,
      ownerId: plan.ownerId,
      draft: added.added,
      groupIds: muscleGroupIdByName(tx),
      timestamp: now(),
    });
    return { ok: true, dayId };
  });
}

export async function removeDayFromPlan(
  planId: string,
  dayId: string,
): Promise<{ ok: true } | { ok: false; reason: 'last-day' | 'missing' }> {
  return run((tx) => {
    const stored = loadStoredDays(tx, planId);
    const day = stored.find((item) => item.id === dayId);
    if (!day) {
      return { ok: false, reason: 'missing' };
    }

    const removed = removeWorkoutDay(
      stored.map((item) => ({ name: item.name, weekday: item.weekday, emphasis: item.emphasis })),
      day.weekday,
    );
    if (!removed.ok) {
      return { ok: false, reason: removed.reason === 'missing' ? 'missing' : 'last-day' };
    }

    softDeleteDay(tx, dayId);
    return { ok: true };
  });
}

export async function moveDayInPlan(
  planId: string,
  dayId: string,
  weekday: Weekday,
): Promise<{ ok: true } | { ok: false; reason: 'occupied' | 'missing' }> {
  return run((tx) => {
    const stored = loadStoredDays(tx, planId);
    const day = stored.find((item) => item.id === dayId);
    if (!day) {
      return { ok: false, reason: 'missing' };
    }

    const moved = moveWorkoutDay(
      stored.map((item) => ({ name: item.name, weekday: item.weekday, emphasis: item.emphasis })),
      day.weekday,
      weekday,
    );
    if (!moved.ok) {
      return { ok: false, reason: moved.reason === 'missing' ? 'missing' : 'occupied' };
    }

    tx.update(workoutDays).set({ weekday, updatedAt: now() }).where(eq(workoutDays.id, dayId)).run();
    return { ok: true };
  });
}

export async function changeDayEmphasis(planId: string, dayId: string, change: EmphasisChange): Promise<void> {
  run((tx) => {
    const day = findStoredDay(tx, planId, dayId);
    if (!day) {
      return;
    }

    persistEmphasis(tx, day, changeEmphasis(day.emphasis, change));
  });
}

export async function allocateExerciseOnDay(
  planId: string,
  dayId: string,
  exerciseId: string,
): Promise<{ ok: true } | { ok: false; reason: 'duplicate' | 'missing' }> {
  return run((tx) => {
    const plan = findPlan(tx, planId);
    const day = findStoredDay(tx, planId, dayId);
    if (!plan || !day) {
      return { ok: false, reason: 'missing' };
    }

    const current = loadExercises(tx, [dayId]).get(dayId) ?? [];
    const allocated = allocateExercise(
      current.map((exercise) => exercise.exerciseId),
      exerciseId,
    );
    if (!allocated.ok) {
      return { ok: false, reason: 'duplicate' };
    }

    const timestamp = now();
    tx.insert(plannedExercises)
      .values({
        id: createId(),
        workoutDayId: dayId,
        ownerId: plan.ownerId,
        exerciseId,
        sortOrder: allocated.exerciseIds.indexOf(exerciseId),
        targetSets: null,
        targetRepMin: null,
        targetRepMax: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();
    return { ok: true };
  });
}

export async function updatePlannedExerciseTarget(
  planId: string,
  dayId: string,
  plannedExerciseId: string,
  next: ExerciseTarget,
): Promise<{ ok: true } | { ok: false; reason: 'rejected' | 'missing' }> {
  return run((tx) => {
    const current = (loadExercises(tx, [dayId]).get(dayId) ?? []).find((exercise) => exercise.id === plannedExerciseId);
    const day = findStoredDay(tx, planId, dayId);
    if (!day || !current) {
      return { ok: false, reason: 'missing' };
    }

    const applied = applyExerciseTarget(current.target, next);
    if (!applied.ok) {
      return { ok: false, reason: 'rejected' };
    }

    tx.update(plannedExercises)
      .set({
        targetSets: applied.target.sets,
        targetRepMin: applied.target.repMin,
        targetRepMax: applied.target.repMax,
        updatedAt: now(),
      })
      .where(and(eq(plannedExercises.id, plannedExerciseId), isNull(plannedExercises.deletedAt)))
      .run();
    return { ok: true };
  });
}

export async function reorderPlannedExercise(
  planId: string,
  dayId: string,
  plannedExerciseId: string,
  direction: 'up' | 'down',
): Promise<void> {
  run((tx) => {
    const day = findStoredDay(tx, planId, dayId);
    if (!day) {
      return;
    }

    const current = loadExercises(tx, [dayId]).get(dayId) ?? [];
    const exercise = current.find((item) => item.id === plannedExerciseId);
    if (!exercise) {
      return;
    }

    const orderedIds = moveExercise(
      current.map((item) => item.exerciseId),
      exercise.exerciseId,
      direction,
    );
    const timestamp = now();
    orderedIds.forEach((exerciseId, index) => {
      tx.update(plannedExercises)
        .set({ sortOrder: index, updatedAt: timestamp })
        .where(
          and(
            eq(plannedExercises.workoutDayId, dayId),
            eq(plannedExercises.exerciseId, exerciseId),
            isNull(plannedExercises.deletedAt),
          ),
        )
        .run();
    });
  });
}
