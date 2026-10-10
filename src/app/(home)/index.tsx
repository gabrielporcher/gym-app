import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useHome } from '@/hooks/use-home';

export default function HomeScreen() {
  const { ready, hasActivePlan, days, inProgress, suggestion, begin, refresh } = useHome();
  const [choosing, setChoosing] = useState(false);

  async function startDay(workoutDayId: string) {
    const result = await begin(workoutDayId);
    if (!result.ok) {
      await refresh();
      return;
    }

    setChoosing(false);
    router.push(`./session/${result.sessionId}`, { relativeToDirectory: true });
  }

  if (!ready) {
    return <Screen edges={['left', 'right']}>{null}</Screen>;
  }

  if (inProgress) {
    return (
      <Screen edges={['left', 'right']}>
        <View style={styles.content}>
          <Text>{inProgress.dayName}</Text>
          <Button
            onPress={() => router.push(`./session/${inProgress.id}`, { relativeToDirectory: true })}>
            Continuar treino
          </Button>
        </View>
      </Screen>
    );
  }

  if (!hasActivePlan) {
    return (
      <Screen edges={['left', 'right']}>
        <Text>Nada por aqui ainda.</Text>
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {suggestion ? <Text>{suggestion.name}</Text> : <Text>Os treinos desta semana já foram feitos.</Text>}
        {suggestion ? (
          <Button onPress={() => void startDay(suggestion.id)}>Treinar</Button>
        ) : null}
        {choosing ? (
          <View style={styles.content}>
            {days.map((day) => (
              <Button key={day.id} variant="plain" onPress={() => void startDay(day.id)}>
                {day.name}
              </Button>
            ))}
            <Button variant="plain" onPress={() => setChoosing(false)}>
              Cancelar
            </Button>
          </View>
        ) : (
          <Button variant="plain" onPress={() => setChoosing(true)}>
            Outro treino
          </Button>
        )}
      </ScrollView>
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
