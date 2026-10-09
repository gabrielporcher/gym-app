import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ExerciseSelector } from '@/components/workout-plan/exercise-selector';
import { PlannedExerciseList } from '@/components/workout-plan/planned-exercise-list';
import { Spacing } from '@/constants/theme';
import { useWorkoutDay } from '@/hooks/use-workout-plan';

function routeParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
}

export default function WorkoutDayScreen() {
  const params = useLocalSearchParams<{ planId: string; dayId: string }>();
  const planId = routeParam(params.planId);
  const dayId = routeParam(params.dayId);
  const { day, groups, text, muscleGroup, selector, setText, setMuscleGroup, allocate, reorder, saveTarget } =
    useWorkoutDay(planId, dayId);
  const [selecting, setSelecting] = useState(false);

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Exercícios', headerLargeTitle: false }} />
      {day === null ? <Text>Esse dia não está mais disponível.</Text> : null}
      {day && !selecting ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <PlannedExerciseList
            exercises={day.exercises}
            onMove={(plannedExerciseId, direction) => void reorder(plannedExerciseId, direction)}
            onCommitTarget={(plannedExerciseId, target) => saveTarget(plannedExerciseId, target)}
            onAdd={() => setSelecting(true)}
          />
        </ScrollView>
      ) : null}
      {day && selecting && selector ? (
        <ExerciseSelector
          groups={groups}
          list={selector}
          text={text}
          muscleGroup={muscleGroup}
          onChangeText={setText}
          onChangeMuscleGroup={setMuscleGroup}
          onChoose={(exerciseId) => void allocate(exerciseId)}
          onCancel={() => {
            setText('');
            setMuscleGroup(undefined);
            setSelecting(false);
          }}
        />
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
});
