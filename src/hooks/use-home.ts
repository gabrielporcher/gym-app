import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { suggestWorkoutDay, type SuggestableWorkoutDay } from '@/domain/session';
import {
  getInProgressSession,
  listCompletedSessionsForActivePlan,
  startSession,
  type CompletedSessionForSuggestion,
  type SessionDetails,
} from '@/repositories/session';
import { listWorkoutPlans, type WorkoutDaySummary, type WorkoutPlanSummary } from '@/repositories/workout-plan';

type HomeSnapshot = {
  active: WorkoutPlanSummary | null;
  session: SessionDetails | null;
  completed: CompletedSessionForSuggestion[];
};

export function useHome() {
  const [ready, setReady] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [days, setDays] = useState<WorkoutDaySummary[]>([]);
  const [inProgress, setInProgress] = useState<SessionDetails | null>(null);
  const [suggestion, setSuggestion] = useState<SuggestableWorkoutDay | null>(null);

  const load = useCallback(async (): Promise<HomeSnapshot> => {
    const [plans, session, completed] = await Promise.all([
      listWorkoutPlans(),
      getInProgressSession(),
      listCompletedSessionsForActivePlan(),
    ]);
    return { active: plans.active, session, completed };
  }, []);

  const publish = useCallback((snapshot: HomeSnapshot) => {
    const activeDays = snapshot.active?.days ?? [];
    setHasActivePlan(snapshot.active !== null);
    setDays(activeDays);
    setInProgress(snapshot.session);
    setSuggestion(
      snapshot.active
        ? suggestWorkoutDay(
            activeDays.map((day) => ({ id: day.id, name: day.name, weekday: day.weekday })),
            snapshot.completed.map((item) => ({
              workoutDayId: item.workoutDayId,
              startedAt: new Date(item.startedAt),
            })),
            new Date(),
          )
        : null,
    );
    setReady(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void load().then((snapshot) => {
        if (active) {
          publish(snapshot);
        }
      });
      return () => {
        active = false;
      };
    }, [load, publish]),
  );

  return {
    ready,
    hasActivePlan,
    days,
    inProgress,
    suggestion,
    begin: (workoutDayId: string) => startSession(workoutDayId),
    refresh: async () => {
      publish(await load());
    },
  };
}
