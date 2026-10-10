import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { SessionExerciseList } from '@/components/session/session-exercise-list';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';

function routeParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
}

export default function SessionScreen() {
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = routeParam(params.sessionId);
  const { session, complete, abandon, removeExercise } = useSession(sessionId);
  const editable = session?.status === 'in_progress';
  const hasSet = session?.exercises.some((exercise) => exercise.sets.length > 0) ?? false;

  function leaveHome() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(home)');
  }

  function askComplete() {
    Alert.alert('Concluir treino?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        onPress: () => {
          void complete().then((ok) => {
            if (ok) {
              leaveHome();
            }
          });
        },
      },
    ]);
  }

  function askAbandon() {
    Alert.alert('Abandonar treino?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Abandonar',
        style: 'destructive',
        onPress: () => {
          void abandon().then((ok) => {
            if (ok) {
              leaveHome();
            }
          });
        },
      },
    ]);
  }

  function askRemove(exercise: { id: string; sets: readonly { id: string }[] }) {
    if (exercise.sets.length === 0) {
      void removeExercise(exercise.id);
      return;
    }

    Alert.alert('Remover exercício?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void removeExercise(exercise.id);
        },
      },
    ]);
  }

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: session?.dayName ?? 'Treino', headerLargeTitle: false }} />
      {session === null ? <Text>Esse treino não está mais disponível.</Text> : null}
      {session ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {session.exercises.length === 0 ? <Text>Nenhum exercício neste treino.</Text> : null}
          <SessionExerciseList
            exercises={session.exercises}
            editable={editable}
            onOpen={(sessionExerciseId) =>
              router.push(`./exercises/${sessionExerciseId}`, { relativeToDirectory: true })
            }
            onRemove={askRemove}
          />
          {editable ? (
            <View style={styles.actions}>
              <Button onPress={() => router.push('./add-exercise', { relativeToDirectory: true })}>
                Acrescentar exercício
              </Button>
              {hasSet ? (
                <Button onPress={askComplete}>Concluir treino</Button>
              ) : null}
              <Button variant="destructive" onPress={askAbandon}>
                Abandonar treino
              </Button>
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
