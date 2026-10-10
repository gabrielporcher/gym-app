import { router, Stack, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ExerciseSelector } from '@/components/workout-plan/exercise-selector';
import { useAddSessionExercise } from '@/hooks/use-session';

function routeParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
}

export default function AddSessionExerciseScreen() {
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = routeParam(params.sessionId);
  const { groups, list, text, muscleGroup, selectedIds, setText, setMuscleGroup, toggle, confirm } =
    useAddSessionExercise(sessionId);

  async function confirmSelection() {
    const added = await confirm();
    if (added) {
      router.back();
    }
  }

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Acrescentar exercício', headerLargeTitle: false }} />
      {sessionId ? (
        <ExerciseSelector
          mode="single"
          groups={groups}
          list={list}
          text={text}
          muscleGroup={muscleGroup}
          selectedIds={selectedIds}
          onChangeText={setText}
          onChangeMuscleGroup={setMuscleGroup}
          onToggle={toggle}
          onConfirm={() => void confirmSelection()}
          onCancel={() => router.back()}
        />
      ) : (
        <Text>Esse treino não está mais disponível.</Text>
      )}
    </Screen>
  );
}
