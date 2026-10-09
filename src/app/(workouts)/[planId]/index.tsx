import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { NameField } from '@/components/workout-plan/name-field';
import { WeekdayStrip } from '@/components/workout-plan/weekday-strip';
import { WorkoutDayCard } from '@/components/workout-plan/workout-day-card';
import { Spacing } from '@/constants/theme';
import { useWorkoutPlan } from '@/hooks/use-workout-plan';

function routeParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
}

export default function WorkoutPlanScreen() {
  const params = useLocalSearchParams<{ planId: string }>();
  const planId = routeParam(params.planId);
  const { plan, canAddDay, canRemoveDay, openWeekdays, rename, renameDay, addDay, removeDay, moveDay } =
    useWorkoutPlan(planId);
  const [movingDayId, setMovingDayId] = useState<string | null>(null);

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: plan?.name ?? 'Plano', headerLargeTitle: false }} />
      {plan === null ? <Text>Esse plano não está mais disponível.</Text> : null}
      {plan ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <NameField
            key={plan.name}
            value={plan.name}
            onCommit={(name) => void rename(name)}
            accessibilityLabel="Nome do plano"
          />
          <WeekdayStrip days={plan.days} />
          {canAddDay ? <Button onPress={() => void addDay()}>Acrescentar dia</Button> : null}
          <View style={styles.days}>
            {plan.days.map((day) => (
              <WorkoutDayCard
                key={day.id}
                name={day.name}
                tags={day.tags}
                canRemove={canRemoveDay}
                destinations={openWeekdays}
                moving={movingDayId === day.id}
                onRename={(name) => void renameDay(day.id, name)}
                onRemove={() => void removeDay(day.id)}
                onStartMove={() => setMovingDayId(day.id)}
                onCancelMove={() => setMovingDayId(null)}
                onMove={(weekday) => {
                  setMovingDayId(null);
                  void moveDay(day.id, weekday);
                }}
                onOpenExercises={() => router.push(`./days/${day.id}`, { relativeToDirectory: true })}
              />
            ))}
          </View>
        </ScrollView>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  days: {
    gap: Spacing.md,
  },
});
