import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { CatalogExercise, CatalogMuscleGroup } from '@/domain/exercise-catalog';
import {
  canAddWorkoutDay,
  canRemoveWorkoutDay,
  freeWeekdays,
  listExercisesForDay,
  SPLIT_TEMPLATES,
  type EmphasisChange,
  type ExerciseSelectorList,
  type ExerciseTarget,
  type SplitTemplateId,
  type Weekday,
} from '@/domain/workout-plan';
import { listExercises, listMuscleGroups } from '@/repositories/exercise-catalog';
import {
  addDayToPlan,
  allocateExerciseOnDay,
  changeDayEmphasis,
  createWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutDay,
  getWorkoutPlan,
  listWorkoutPlans,
  moveDayInPlan,
  reactivateWorkoutPlan,
  removeDayFromPlan,
  renameWorkoutDay,
  renameWorkoutPlan,
  reorderPlannedExercise,
  updatePlannedExerciseTarget,
  type WorkoutDayDetails,
  type WorkoutPlanDetails,
  type WorkoutPlanSummary,
} from '@/repositories/workout-plan';

export type WorkoutPlanList = {
  active: WorkoutPlanSummary | null;
  archived: WorkoutPlanSummary[];
};

export function useWorkoutPlanList() {
  const [plans, setPlans] = useState<WorkoutPlanList | undefined>(undefined);

  const refresh = useCallback(async () => {
    const next = await listWorkoutPlans();
    setPlans(next);
    return next;
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listWorkoutPlans().then((next) => {
        if (active) {
          setPlans(next);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return {
    plans,
    refresh,
    reactivate: async (planId: string) => {
      await reactivateWorkoutPlan(planId);
      await refresh();
    },
    remove: async (planId: string) => {
      await deleteWorkoutPlan(planId);
      await refresh();
    },
  };
}

export function useNewWorkoutPlan() {
  const [activeName, setActiveName] = useState<string | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    const next = await listWorkoutPlans();
    const name = next.active?.name ?? null;
    setActiveName(name);
    return name;
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listWorkoutPlans().then((next) => {
        if (active) {
          setActiveName(next.active?.name ?? null);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return {
    templates: SPLIT_TEMPLATES,
    activeName,
    create: async (templateId: SplitTemplateId, archiveActive: boolean) => {
      const result = await createWorkoutPlan(templateId, { archiveActive });
      await refresh();
      return result;
    },
  };
}

export function useWorkoutPlan(planId: string | null) {
  const [plan, setPlan] = useState<WorkoutPlanDetails | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    const next = planId ? await getWorkoutPlan(planId) : null;
    setPlan(next);
    return next;
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = planId ? getWorkoutPlan(planId) : Promise.resolve(null);
      load.then((next) => {
        if (active) {
          setPlan(next);
        }
      });
      return () => {
        active = false;
      };
    }, [planId]),
  );

  async function run(work: () => Promise<unknown>) {
    if (!planId) {
      return;
    }
    await work();
    await refresh();
  }

  return {
    plan,
    canAddDay: plan ? canAddWorkoutDay(plan.days) : false,
    canRemoveDay: plan ? canRemoveWorkoutDay(plan.days) : false,
    openWeekdays: plan ? freeWeekdays(plan.days) : [],
    rename: (name: string) => run(() => (planId ? renameWorkoutPlan(planId, name) : Promise.resolve())),
    renameDay: (dayId: string, name: string) =>
      run(() => (planId ? renameWorkoutDay(planId, dayId, name) : Promise.resolve())),
    addDay: () => run(() => (planId ? addDayToPlan(planId) : Promise.resolve())),
    removeDay: (dayId: string) => run(() => (planId ? removeDayFromPlan(planId, dayId) : Promise.resolve())),
    moveDay: (dayId: string, weekday: Weekday) =>
      run(() => (planId ? moveDayInPlan(planId, dayId, weekday) : Promise.resolve())),
    changeEmphasis: (dayId: string, change: EmphasisChange) =>
      run(() => (planId ? changeDayEmphasis(planId, dayId, change) : Promise.resolve())),
  };
}

export function useWorkoutDay(planId: string | null, dayId: string | null) {
  const [day, setDay] = useState<WorkoutDayDetails | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<CatalogExercise[]>([]);
  const [groups, setGroups] = useState<CatalogMuscleGroup[]>([]);
  const [text, setText] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<string | undefined>(undefined);

  const request = useRef(0);
  const refresh = useCallback(async () => {
    if (!planId || !dayId) {
      setDay(null);
      return;
    }

    const current = request.current + 1;
    request.current = current;
    const [nextDay, nextCatalog, nextGroups] = await Promise.all([
      getWorkoutDay(planId, dayId),
      listExercises(),
      listMuscleGroups(),
    ]);
    if (request.current !== current) {
      return;
    }

    setDay(nextDay);
    setCatalog(nextCatalog);
    setGroups(nextGroups);
  }, [planId, dayId]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return () => {
        request.current += 1;
      };
    }, [refresh]),
  );

  const selector: ExerciseSelectorList | null = useMemo(() => {
    if (!day) {
      return null;
    }

    return listExercisesForDay(catalog, { text, muscleGroup }, day.emphasis);
  }, [catalog, day, muscleGroup, text]);

  async function run(work: () => Promise<unknown>) {
    await work();
    await refresh();
  }

  return {
    day,
    groups,
    text,
    muscleGroup,
    selector,
    setText,
    setMuscleGroup,
    allocate: (exerciseId: string) =>
      run(() => (planId && dayId ? allocateExerciseOnDay(planId, dayId, exerciseId) : Promise.resolve())),
    reorder: (plannedExerciseId: string, direction: 'up' | 'down') =>
      run(() =>
        planId && dayId ? reorderPlannedExercise(planId, dayId, plannedExerciseId, direction) : Promise.resolve(),
      ),
    saveTarget: async (plannedExerciseId: string, target: ExerciseTarget) => {
      if (!planId || !dayId) {
        return false;
      }

      const result = await updatePlannedExerciseTarget(planId, dayId, plannedExerciseId, target);
      await refresh();
      return result.ok;
    },
  };
}
