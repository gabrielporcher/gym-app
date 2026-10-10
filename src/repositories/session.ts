import { and, asc, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  exercises,
  localOwner,
  plannedExercises,
  sessionExercises,
  sessions,
  sets,
  workoutDays,
  workoutPlans,
} from '@/db/schema';
import type { LoadTypeName } from '@/domain/exercise-catalog';
import {
  parseSet,
  type RecordedSet,
  type SessionExerciseState,
  type SessionExerciseTarget,
} from '@/domain/session';
import { createId } from '@/lib/create-id';

const LOCAL_OWNER_ROW_ID = 'local';

const LOAD_TYPE_LABEL = {
  barbell: 'barra',
  dumbbell: 'halter',
  machine: 'máquina',
  bodyweight: 'peso corporal',
  cable: 'cabo',
} as const satisfies Record<string, LoadTypeName>;

type Database = typeof db;
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export type SessionStatus = 'in_progress' | 'completed';
export type SessionSet = RecordedSet;

export type SessionExerciseDetails = {
  id: string;
  exerciseId: string;
  name: string;
  position: number;
  loadType: LoadTypeName;
  target: SessionExerciseTarget;
  completedAt: string | null;
  state: SessionExerciseState;
  sets: SessionSet[];
};

export type SessionDetails = {
  id: string;
  planId: string;
  workoutDayId: string;
  dayName: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  exercises: SessionExerciseDetails[];
};

export type CompletedSessionForSuggestion = {
  workoutDayId: string;
  startedAt: string;
};

type SetInput = string | number;

function now(): string {
  return new Date().toISOString();
}

function run<T>(work: (tx: Transaction) => T): T {
  return db.transaction(work);
}

function asStatus(value: string): SessionStatus {
  if (value === 'in_progress' || value === 'completed') {
    return value;
  }

  throw new Error(`Estado de sessão inválido: ${value}`);
}

function asLoadType(value: string): LoadTypeName {
  if (value === 'barbell' || value === 'dumbbell' || value === 'machine' || value === 'bodyweight' || value === 'cable') {
    return LOAD_TYPE_LABEL[value];
  }

  throw new Error(`Tipo de carga inválido: ${value}`);
}

function deriveState(setCount: number, completedAt: string | null): SessionExerciseState {
  if (setCount === 0) {
    return 'not-started';
  }

  if (completedAt) {
    return 'completed';
  }

  return 'in-progress';
}

function loadSession(tx: Transaction, sessionId: string): SessionDetails | null {
  const row =
    tx
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), isNull(sessions.deletedAt)))
      .all()[0] ?? null;
  if (!row) {
    return null;
  }

  const exerciseRows = tx
    .select({
      id: sessionExercises.id,
      exerciseId: sessionExercises.exerciseId,
      name: exercises.name,
      position: sessionExercises.position,
      loadType: exercises.loadType,
      targetSets: sessionExercises.targetSets,
      targetRepMin: sessionExercises.targetRepMin,
      targetRepMax: sessionExercises.targetRepMax,
      targetWeightKg: sessionExercises.targetWeightKg,
      completedAt: sessionExercises.completedAt,
    })
    .from(sessionExercises)
    .innerJoin(exercises, eq(exercises.id, sessionExercises.exerciseId))
    .where(and(eq(sessionExercises.sessionId, sessionId), isNull(sessionExercises.deletedAt)))
    .orderBy(asc(sessionExercises.position))
    .all();

  const exerciseIds = exerciseRows.map((exercise) => exercise.id);
  const setRows =
    exerciseIds.length === 0
      ? []
      : tx
          .select()
          .from(sets)
          .where(and(inArray(sets.sessionExerciseId, exerciseIds), isNull(sets.deletedAt)))
          .orderBy(asc(sets.position))
          .all();

  const setsByExercise = new Map<string, SessionSet[]>();
  for (const setRow of setRows) {
    const current = setsByExercise.get(setRow.sessionExerciseId) ?? [];
    current.push({
      id: setRow.id,
      position: setRow.position,
      reps: setRow.reps,
      weightKg: setRow.weightKg,
    });
    setsByExercise.set(setRow.sessionExerciseId, current);
  }

  return {
    id: row.id,
    planId: row.planId,
    workoutDayId: row.workoutDayId,
    dayName: row.dayName,
    status: asStatus(row.status),
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    exercises: exerciseRows.map((exercise) => {
      const exerciseSets = setsByExercise.get(exercise.id) ?? [];
      return {
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        position: exercise.position,
        loadType: asLoadType(exercise.loadType),
        target: {
          sets: exercise.targetSets,
          repMin: exercise.targetRepMin,
          repMax: exercise.targetRepMax,
          weightKg: exercise.targetWeightKg,
        },
        completedAt: exercise.completedAt,
        state: deriveState(exerciseSets.length, exercise.completedAt),
        sets: exerciseSets,
      };
    }),
  };
}

function readOwnerId(tx: Transaction): string | null {
  return tx.select().from(localOwner).where(eq(localOwner.id, LOCAL_OWNER_ROW_ID)).all()[0]?.ownerId ?? null;
}

function findInProgress(tx: Transaction, ownerId: string) {
  return (
    tx
      .select()
      .from(sessions)
      .where(and(eq(sessions.ownerId, ownerId), eq(sessions.status, 'in_progress'), isNull(sessions.deletedAt)))
      .all()[0] ?? null
  );
}

function findOpenSession(tx: Transaction, sessionId: string) {
  const row = tx.select().from(sessions).where(eq(sessions.id, sessionId)).all()[0] ?? null;
  if (!row || row.deletedAt || row.status !== 'in_progress') {
    return null;
  }

  return row;
}

function findOpenExercise(tx: Transaction, sessionExerciseId: string) {
  const row =
    tx
      .select({
        id: sessionExercises.id,
        sessionId: sessionExercises.sessionId,
        ownerId: sessionExercises.ownerId,
        loadType: exercises.loadType,
        completedAt: sessionExercises.completedAt,
        exerciseDeletedAt: sessionExercises.deletedAt,
        sessionDeletedAt: sessions.deletedAt,
        sessionStatus: sessions.status,
      })
      .from(sessionExercises)
      .innerJoin(sessions, eq(sessions.id, sessionExercises.sessionId))
      .innerJoin(exercises, eq(exercises.id, sessionExercises.exerciseId))
      .where(eq(sessionExercises.id, sessionExerciseId))
      .all()[0] ?? null;

  if (!row || row.exerciseDeletedAt || row.sessionDeletedAt || row.sessionStatus !== 'in_progress') {
    return null;
  }

  return row;
}

function liveSets(tx: Transaction, sessionExerciseId: string) {
  return tx
    .select()
    .from(sets)
    .where(and(eq(sets.sessionExerciseId, sessionExerciseId), isNull(sets.deletedAt)))
    .orderBy(asc(sets.position))
    .all();
}

function renumberSets(tx: Transaction, sessionExerciseId: string, timestamp: string): number {
  const remaining = liveSets(tx, sessionExerciseId);
  remaining.forEach((setRow, index) => {
    const position = index + 1;
    if (setRow.position === position) {
      return;
    }

    tx.update(sets).set({ position, updatedAt: timestamp }).where(eq(sets.id, setRow.id)).run();
  });
  return remaining.length;
}

function sessionHasSet(tx: Transaction, sessionId: string): boolean {
  const exerciseIds = tx
    .select({ id: sessionExercises.id })
    .from(sessionExercises)
    .where(and(eq(sessionExercises.sessionId, sessionId), isNull(sessionExercises.deletedAt)))
    .all()
    .map((exercise) => exercise.id);
  if (exerciseIds.length === 0) {
    return false;
  }

  const found = tx
    .select({ id: sets.id })
    .from(sets)
    .where(and(inArray(sets.sessionExerciseId, exerciseIds), isNull(sets.deletedAt)))
    .all();
  return found.length > 0;
}

export async function startSession(
  workoutDayId: string,
): Promise<{ ok: true; sessionId: string } | { ok: false; reason: 'in-progress' | 'missing-day' }> {
  return run((tx) => {
    const day =
      tx
        .select()
        .from(workoutDays)
        .where(and(eq(workoutDays.id, workoutDayId), isNull(workoutDays.deletedAt)))
        .all()[0] ?? null;
    if (!day) {
      return { ok: false, reason: 'missing-day' as const };
    }

    if (findInProgress(tx, day.ownerId)) {
      return { ok: false, reason: 'in-progress' as const };
    }

    const planned = tx
      .select({
        id: plannedExercises.id,
        exerciseId: plannedExercises.exerciseId,
        sortOrder: plannedExercises.sortOrder,
        targetSets: plannedExercises.targetSets,
        targetRepMin: plannedExercises.targetRepMin,
        targetRepMax: plannedExercises.targetRepMax,
        targetWeightKg: plannedExercises.targetWeightKg,
      })
      .from(plannedExercises)
      .innerJoin(exercises, eq(exercises.id, plannedExercises.exerciseId))
      .where(
        and(
          eq(plannedExercises.workoutDayId, workoutDayId),
          isNull(plannedExercises.deletedAt),
          isNull(exercises.deletedAt),
        ),
      )
      .orderBy(asc(plannedExercises.sortOrder))
      .all();

    const timestamp = now();
    const sessionId = createId();
    tx.insert(sessions)
      .values({
        id: sessionId,
        ownerId: day.ownerId,
        planId: day.planId,
        workoutDayId: day.id,
        dayName: day.name,
        status: 'in_progress',
        startedAt: timestamp,
        completedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();

    planned.forEach((exercise, index) => {
      tx.insert(sessionExercises)
        .values({
          id: createId(),
          sessionId,
          ownerId: day.ownerId,
          exerciseId: exercise.exerciseId,
          plannedExerciseId: exercise.id,
          position: index + 1,
          targetSets: exercise.targetSets,
          targetRepMin: exercise.targetRepMin,
          targetRepMax: exercise.targetRepMax,
          targetWeightKg: exercise.targetWeightKg,
          completedAt: null,
          createdAt: timestamp,
          updatedAt: timestamp,
          deletedAt: null,
        })
        .run();
    });

    return { ok: true, sessionId };
  });
}

export async function getInProgressSession(): Promise<SessionDetails | null> {
  return run((tx) => {
    const ownerId = readOwnerId(tx);
    if (!ownerId) {
      return null;
    }

    const row = findInProgress(tx, ownerId);
    return row ? loadSession(tx, row.id) : null;
  });
}

export async function getSession(sessionId: string): Promise<SessionDetails | null> {
  return run((tx) => loadSession(tx, sessionId));
}

export async function listCompletedSessionsForActivePlan(): Promise<CompletedSessionForSuggestion[]> {
  return run((tx) => {
    const ownerId = readOwnerId(tx);
    if (!ownerId) {
      return [];
    }

    const active =
      tx
        .select()
        .from(workoutPlans)
        .where(
          and(eq(workoutPlans.ownerId, ownerId), eq(workoutPlans.status, 'active'), isNull(workoutPlans.deletedAt)),
        )
        .all()[0] ?? null;
    if (!active) {
      return [];
    }

    return tx
      .select({
        workoutDayId: sessions.workoutDayId,
        startedAt: sessions.startedAt,
      })
      .from(sessions)
      .where(
        and(eq(sessions.planId, active.id), eq(sessions.status, 'completed'), isNull(sessions.deletedAt)),
      )
      .all();
  });
}

export async function recordSet(
  sessionExerciseId: string,
  reps: SetInput,
  weightKg: SetInput,
): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const exercise = findOpenExercise(tx, sessionExerciseId);
    if (!exercise) {
      return { ok: false };
    }

    const parsed = parseSet(reps, weightKg, asLoadType(exercise.loadType));
    if (!parsed.ok) {
      return { ok: false };
    }

    const timestamp = now();
    const position = liveSets(tx, sessionExerciseId).reduce((max, setRow) => Math.max(max, setRow.position), 0) + 1;
    tx.insert(sets)
      .values({
        id: createId(),
        sessionExerciseId,
        ownerId: exercise.ownerId,
        position,
        reps: parsed.set.reps,
        weightKg: parsed.set.weightKg,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();
    return { ok: true };
  });
}

export async function updateSet(
  setId: string,
  reps: SetInput,
  weightKg: SetInput,
): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const setRow = tx.select().from(sets).where(eq(sets.id, setId)).all()[0] ?? null;
    if (!setRow || setRow.deletedAt) {
      return { ok: false };
    }

    const exercise = findOpenExercise(tx, setRow.sessionExerciseId);
    if (!exercise) {
      return { ok: false };
    }

    const parsed = parseSet(reps, weightKg, asLoadType(exercise.loadType));
    if (!parsed.ok) {
      return { ok: false };
    }

    tx.update(sets)
      .set({ reps: parsed.set.reps, weightKg: parsed.set.weightKg, updatedAt: now() })
      .where(and(eq(sets.id, setId), isNull(sets.deletedAt)))
      .run();
    return { ok: true };
  });
}

export async function removeSet(setId: string): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const setRow = tx.select().from(sets).where(eq(sets.id, setId)).all()[0] ?? null;
    if (!setRow || setRow.deletedAt) {
      return { ok: false };
    }

    const exercise = findOpenExercise(tx, setRow.sessionExerciseId);
    if (!exercise) {
      return { ok: false };
    }

    const timestamp = now();
    tx.update(sets)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sets.id, setId), isNull(sets.deletedAt)))
      .run();
    const remaining = renumberSets(tx, setRow.sessionExerciseId, timestamp);
    if (remaining === 0) {
      tx.update(sessionExercises)
        .set({ completedAt: null, updatedAt: timestamp })
        .where(eq(sessionExercises.id, setRow.sessionExerciseId))
        .run();
    }
    return { ok: true };
  });
}

export async function completeExercise(sessionExerciseId: string): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const exercise = findOpenExercise(tx, sessionExerciseId);
    if (!exercise) {
      return { ok: false };
    }

    if (liveSets(tx, sessionExerciseId).length === 0) {
      return { ok: false };
    }

    if (!exercise.completedAt) {
      const timestamp = now();
      tx.update(sessionExercises)
        .set({ completedAt: timestamp, updatedAt: timestamp })
        .where(and(eq(sessionExercises.id, sessionExerciseId), isNull(sessionExercises.deletedAt)))
        .run();
    }

    return { ok: true };
  });
}

export async function addSessionExercise(
  sessionId: string,
  exerciseId: string,
): Promise<{ ok: true; sessionExerciseId: string } | { ok: false; reason: 'duplicate' | 'missing' | 'closed' }> {
  return run((tx) => {
    const session = findOpenSession(tx, sessionId);
    if (!session) {
      return { ok: false, reason: 'closed' as const };
    }

    const exercise =
      tx
        .select()
        .from(exercises)
        .where(and(eq(exercises.id, exerciseId), isNull(exercises.deletedAt)))
        .all()[0] ?? null;
    if (!exercise) {
      return { ok: false, reason: 'missing' as const };
    }

    const duplicate =
      tx
        .select({ id: sessionExercises.id })
        .from(sessionExercises)
        .where(
          and(
            eq(sessionExercises.sessionId, sessionId),
            eq(sessionExercises.exerciseId, exerciseId),
            isNull(sessionExercises.deletedAt),
          ),
        )
        .all()[0] ?? null;
    if (duplicate) {
      return { ok: false, reason: 'duplicate' as const };
    }

    const positions = tx
      .select({ position: sessionExercises.position })
      .from(sessionExercises)
      .where(and(eq(sessionExercises.sessionId, sessionId), isNull(sessionExercises.deletedAt)))
      .all();
    const timestamp = now();
    const sessionExerciseId = createId();
    tx.insert(sessionExercises)
      .values({
        id: sessionExerciseId,
        sessionId,
        ownerId: session.ownerId,
        exerciseId,
        plannedExerciseId: null,
        position: positions.reduce((max, row) => Math.max(max, row.position), 0) + 1,
        targetSets: null,
        targetRepMin: null,
        targetRepMax: null,
        targetWeightKg: null,
        completedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      .run();
    return { ok: true, sessionExerciseId };
  });
}

export async function removeSessionExercise(sessionExerciseId: string): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const exercise = findOpenExercise(tx, sessionExerciseId);
    if (!exercise) {
      return { ok: false };
    }

    const timestamp = now();
    tx.update(sets)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sets.sessionExerciseId, sessionExerciseId), isNull(sets.deletedAt)))
      .run();
    tx.update(sessionExercises)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sessionExercises.id, sessionExerciseId), isNull(sessionExercises.deletedAt)))
      .run();
    return { ok: true };
  });
}

export async function completeSession(sessionId: string): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const session = findOpenSession(tx, sessionId);
    if (!session || !sessionHasSet(tx, sessionId)) {
      return { ok: false };
    }

    const timestamp = now();
    tx.update(sessions)
      .set({ status: 'completed', completedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sessions.id, sessionId), isNull(sessions.deletedAt)))
      .run();
    return { ok: true };
  });
}

export async function abandonSession(sessionId: string): Promise<{ ok: true } | { ok: false }> {
  return run((tx) => {
    const session = findOpenSession(tx, sessionId);
    if (!session) {
      return { ok: false };
    }

    const timestamp = now();
    const exerciseIds = tx
      .select({ id: sessionExercises.id })
      .from(sessionExercises)
      .where(eq(sessionExercises.sessionId, sessionId))
      .all()
      .map((exercise) => exercise.id);
    if (exerciseIds.length > 0) {
      tx.update(sets)
        .set({ deletedAt: timestamp, updatedAt: timestamp })
        .where(and(inArray(sets.sessionExerciseId, exerciseIds), isNull(sets.deletedAt)))
        .run();
    }
    tx.update(sessionExercises)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sessionExercises.sessionId, sessionId), isNull(sessionExercises.deletedAt)))
      .run();
    tx.update(sessions)
      .set({ deletedAt: timestamp, updatedAt: timestamp })
      .where(and(eq(sessions.id, sessionId), isNull(sessions.deletedAt)))
      .run();
    return { ok: true };
  });
}
