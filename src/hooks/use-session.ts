import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import type { CatalogExercise, CatalogMuscleGroup } from '@/domain/exercise-catalog';
import { nextSetDraft, type SetDraft } from '@/domain/session';
import { listExercisesForDay, type ExerciseSelectorList } from '@/domain/workout-plan';
import { listExercises, listMuscleGroups } from '@/repositories/exercise-catalog';
import {
  abandonSession,
  addSessionExercise,
  completeExercise,
  completeSession,
  getSession,
  recordSet,
  removeSessionExercise,
  removeSet,
  updateSet,
  type SessionDetails,
  type SessionExerciseDetails,
} from '@/repositories/session';

export function useSession(sessionId: string | null) {
  const [session, setSession] = useState<SessionDetails | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    const next = sessionId ? await getSession(sessionId) : null;
    setSession(next);
    return next;
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = sessionId ? getSession(sessionId) : Promise.resolve(null);
      void load.then((next) => {
        if (active) {
          setSession(next);
        }
      });
      return () => {
        active = false;
      };
    }, [sessionId]),
  );

  return {
    session,
    complete: async () => {
      if (!sessionId) {
        return false;
      }

      const result = await completeSession(sessionId);
      await refresh();
      return result.ok;
    },
    abandon: async () => {
      if (!sessionId) {
        return false;
      }

      const result = await abandonSession(sessionId);
      return result.ok;
    },
    removeExercise: async (sessionExerciseId: string) => {
      const result = await removeSessionExercise(sessionExerciseId);
      await refresh();
      return result.ok;
    },
  };
}

export function useSessionExercise(sessionId: string | null, sessionExerciseId: string | null) {
  const [session, setSession] = useState<SessionDetails | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    const next = sessionId ? await getSession(sessionId) : null;
    setSession(next);
    return next;
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = sessionId ? getSession(sessionId) : Promise.resolve(null);
      void load.then((next) => {
        if (active) {
          setSession(next);
        }
      });
      return () => {
        active = false;
      };
    }, [sessionId]),
  );

  const exercise: SessionExerciseDetails | null =
    session?.exercises.find((item) => item.id === sessionExerciseId) ?? null;
  const last = exercise?.sets[exercise.sets.length - 1];
  const suggested: SetDraft = exercise
    ? nextSetDraft(last ? { reps: last.reps, weightKg: last.weightKg } : null, {
        repMin: exercise.target.repMin,
        weightKg: exercise.target.weightKg,
      })
    : { reps: '', weightKg: '' };

  return {
    session,
    exercise,
    suggested,
    editable: session?.status === 'in_progress',
    saveDraft: async (reps: string, weightKg: string) => {
      if (!sessionExerciseId || session?.status !== 'in_progress') {
        return false;
      }

      const result = await recordSet(sessionExerciseId, reps, weightKg);
      await refresh();
      return result.ok;
    },
    saveSet: async (setId: string, reps: string, weightKg: string) => {
      if (session?.status !== 'in_progress') {
        return false;
      }

      const result = await updateSet(setId, reps, weightKg);
      await refresh();
      return result.ok;
    },
    removeRecordedSet: async (setId: string) => {
      if (session?.status !== 'in_progress') {
        return false;
      }

      const result = await removeSet(setId);
      await refresh();
      return result.ok;
    },
    complete: async () => {
      if (!sessionExerciseId || session?.status !== 'in_progress') {
        return false;
      }

      const result = await completeExercise(sessionExerciseId);
      await refresh();
      return result.ok;
    },
  };
}

export function useAddSessionExercise(sessionId: string | null) {
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [catalog, setCatalog] = useState<CatalogExercise[]>([]);
  const [groups, setGroups] = useState<CatalogMuscleGroup[]>([]);
  const [text, setText] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [nextSession, nextCatalog, nextGroups] = await Promise.all([
      sessionId ? getSession(sessionId) : Promise.resolve(null),
      listExercises(),
      listMuscleGroups(),
    ]);
    setSession(nextSession);
    setCatalog(nextCatalog);
    setGroups(nextGroups);
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const list: ExerciseSelectorList = useMemo(() => {
    const present = new Set((session?.exercises ?? []).map((exercise) => exercise.exerciseId));
    const available = catalog.filter((exercise) => !present.has(exercise.id));
    return listExercisesForDay(available, { text, muscleGroup }, { mode: 'groups', groups: [] });
  }, [catalog, muscleGroup, session, text]);

  return {
    groups,
    list,
    text,
    muscleGroup,
    selectedIds: selectedId ? [selectedId] : [],
    setText,
    setMuscleGroup,
    toggle: (exerciseId: string) => {
      setSelectedId((current) => (current === exerciseId ? null : exerciseId));
    },
    confirm: async () => {
      if (!sessionId || !selectedId || session?.status !== 'in_progress') {
        return false;
      }

      const result = await addSessionExercise(sessionId, selectedId);
      if (result.ok) {
        await refresh();
      }
      return result.ok;
    },
  };
}
