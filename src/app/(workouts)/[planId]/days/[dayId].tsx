import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const navigation = useNavigation();
  const { day, groups, text, muscleGroup, selector, setText, setMuscleGroup, allocateMany, reorder, saveTarget } =
    useWorkoutDay(planId, dayId);
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function leaveSelection() {
    setSelectedIds([]);
    setText('');
    setMuscleGroup(undefined);
    setSelecting(false);
  }

  useEffect(() => {
    if (!selecting) {
      return undefined;
    }

    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();
      setSelectedIds([]);
      setText('');
      setMuscleGroup(undefined);
      setSelecting(false);
    });

    return unsubscribe;
  }, [navigation, selecting, setMuscleGroup, setText]);

  async function confirmSelection() {
    if (selectedIds.length === 0) {
      return;
    }

    await allocateMany(selectedIds);
    leaveSelection();
  }

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen
        options={{ title: selecting ? 'Adicionar exercícios' : 'Exercícios', headerLargeTitle: false }}
      />
      {day === null ? <Text>Esse dia não está mais disponível.</Text> : null}
      {day && !selecting ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <PlannedExerciseList
            exercises={day.exercises}
            onMove={(plannedExerciseId, direction) => void reorder(plannedExerciseId, direction)}
            onCommitTarget={(plannedExerciseId, target) => saveTarget(plannedExerciseId, target)}
            onAdd={() => {
              setSelectedIds([]);
              setSelecting(true);
            }}
          />
        </ScrollView>
      ) : null}
      {day && selecting && selector ? (
        <ExerciseSelector
          groups={groups}
          list={selector}
          text={text}
          muscleGroup={muscleGroup}
          selectedIds={selectedIds}
          onChangeText={setText}
          onChangeMuscleGroup={setMuscleGroup}
          onToggle={(exerciseId) =>
            setSelectedIds((current) =>
              current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId],
            )
          }
          onConfirm={() => void confirmSelection()}
          onCancel={leaveSelection}
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
