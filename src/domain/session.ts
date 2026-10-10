import type { LoadTypeName } from './exercise-catalog';
import type { Weekday } from './workout-plan';

export type SuggestableWorkoutDay = {
  id: string;
  name: string;
  weekday: Weekday;
};

export type CompletedSessionRef = {
  workoutDayId: string;
  startedAt: Date;
};

export type ParsedSet = {
  reps: number;
  weightKg: number;
};

export type SetDraft = {
  reps: string;
  weightKg: string;
};

export type SetDraftTarget = {
  repMin: number | null;
  weightKg: number | null;
};

export type SessionExerciseState = 'not-started' | 'in-progress' | 'completed';

export type RecordedSet = {
  id: string;
  position: number;
  reps: number;
  weightKg: number;
};

export type SessionExerciseTarget = {
  sets: number | null;
  repMin: number | null;
  repMax: number | null;
  weightKg: number | null;
};

const POSITIVE_LOAD: readonly LoadTypeName[] = ['barra', 'halter', 'máquina', 'cabo'];

export function suggestWorkoutDay(
  days: readonly SuggestableWorkoutDay[],
  completedSessions: readonly CompletedSessionRef[],
  now: Date,
): SuggestableWorkoutDay | null {
  const weekStart = startOfLocalWeek(now);
  const weekEnd = addLocalDays(weekStart, 7);
  const doneThisWeek = new Set(
    completedSessions
      .filter((session) => session.startedAt >= weekStart && session.startedAt < weekEnd)
      .map((session) => session.workoutDayId),
  );

  const pending = days
    .filter((day) => !doneThisWeek.has(day.id))
    .sort((left, right) => left.weekday - right.weekday);

  const next = pending[0];
  if (!next) {
    return null;
  }

  return { id: next.id, name: next.name, weekday: next.weekday };
}

export function parseSet(
  reps: string | number,
  weightKg: string | number,
  loadType: LoadTypeName,
): { ok: true; set: ParsedSet } | { ok: false } {
  const parsedReps = parseReps(reps);
  const parsedWeight = parseWeight(weightKg);
  if (parsedReps === null || parsedWeight === null) {
    return { ok: false };
  }

  if (POSITIVE_LOAD.includes(loadType) && parsedWeight <= 0) {
    return { ok: false };
  }

  if (loadType === 'peso corporal' && parsedWeight < 0) {
    return { ok: false };
  }

  return { ok: true, set: { reps: parsedReps, weightKg: parsedWeight } };
}

export function nextSetDraft(
  previous: ParsedSet | null,
  target: SetDraftTarget | null,
): SetDraft {
  if (previous) {
    return { reps: draftField(previous.reps), weightKg: draftField(previous.weightKg) };
  }

  return {
    reps: draftField(target?.repMin),
    weightKg: draftField(target?.weightKg),
  };
}

function startOfLocalWeek(now: Date): Date {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekday = now.getDay() === 0 ? 7 : now.getDay();
  midnight.setDate(midnight.getDate() - (weekday - 1));
  return midnight;
}

function addLocalDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function parseReps(value: string | number): number | null {
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 1) {
      return null;
    }

    return value;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

function parseWeight(value: string | number): number | null {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }

    return value;
  }

  const trimmed = value.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function draftField(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace('.', ',');
}
