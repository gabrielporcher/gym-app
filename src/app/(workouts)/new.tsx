import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/ui/list-item';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useNewWorkoutPlan } from '@/hooks/use-workout-plan';

export default function NewWorkoutPlanScreen() {
  const { templates, activeName, create } = useNewWorkoutPlan();
  const [saving, setSaving] = useState(false);

  async function save(templateId: (typeof templates)[number]['id'], archiveActive: boolean) {
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      const result = await create(templateId, archiveActive);
      if (result.ok) {
        router.replace(`../${result.planId}`, { relativeToDirectory: true });
      }
    } finally {
      setSaving(false);
    }
  }

  function choose(templateId: (typeof templates)[number]['id'], templateName: string) {
    if (activeName === undefined || saving) {
      return;
    }

    if (activeName) {
      Alert.alert('Arquivar plano ativo', `Arquivar "${activeName}" e criar "${templateName}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Arquivar e criar', onPress: () => void save(templateId, true) },
      ]);
      return;
    }

    void save(templateId, false);
  }

  return (
    <Screen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Modelo', headerLargeTitle: false }} />
      {activeName === undefined ? null : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {templates.map((template) => (
            <ListItem
              key={template.id}
              title={template.name}
              subtitle={template.description}
              onPress={() => choose(template.id, template.name)}
            />
          ))}
          <Button variant="plain" onPress={() => router.back()}>
            Cancelar
          </Button>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
});
