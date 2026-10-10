import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SetLogger } from '@/components/session/set-logger';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useSessionExercise } from '@/hooks/use-session';

function routeParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
}

export default function SessionExerciseScreen() {
  const params = useLocalSearchParams<{ sessionId: string; sessionExerciseId: string }>();
  const sessionId = routeParam(params.sessionId);
  const sessionExerciseId = routeParam(params.sessionExerciseId);
  const { session, exercise, suggested, editable, saveDraft, saveSet, removeRecordedSet, complete } =
    useSessionExercise(sessionId, sessionExerciseId);

  async function finishExercise() {
    const ok = await complete();
    if (ok) {
      router.back();
    }
  }

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: exercise?.name ?? 'Exercício', headerLargeTitle: false }} />
      {session === null || (session && !exercise) ? <Text>Esse exercício não está mais disponível.</Text> : null}
      {exercise ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SetLogger
            target={exercise.target}
            sets={exercise.sets}
            suggested={suggested}
            editable={editable}
            onSaveDraft={saveDraft}
            onSaveSet={saveSet}
            onRemoveSet={removeRecordedSet}
          />
          {editable ? (
            <View style={styles.actions}>
              <Button onPress={() => void finishExercise()}>Concluir exercício</Button>
            </View>
          ) : null}
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
  actions: {
    gap: Spacing.sm,
  },
});
