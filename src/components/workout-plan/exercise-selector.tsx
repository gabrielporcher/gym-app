import { FlatList, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListItem } from '@/components/ui/list-item';
import { Text } from '@/components/ui/text';
import { Colors, Radius, resolveScheme, Spacing, TouchTarget } from '@/constants/theme';
import type { CatalogExercise, CatalogMuscleGroup } from '@/domain/exercise-catalog';
import type { ExerciseSelectorList } from '@/domain/workout-plan';

type SelectorRow =
  | { type: 'header'; title: string }
  | { type: 'exercise'; exercise: CatalogExercise };

type ExerciseSelectorProps = {
  groups: readonly CatalogMuscleGroup[];
  list: ExerciseSelectorList;
  text: string;
  muscleGroup?: string;
  selectedIds: readonly string[];
  mode?: 'multiple' | 'single';
  onChangeText: (value: string) => void;
  onChangeMuscleGroup: (value: string | undefined) => void;
  onToggle: (exerciseId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

function rowsOf(list: ExerciseSelectorList): SelectorRow[] {
  if (!list.titled) {
    return list.exercises.map((exercise) => ({ type: 'exercise', exercise }));
  }

  return [
    { type: 'header', title: 'Sugeridos' },
    ...list.suggested.map((exercise) => ({ type: 'exercise' as const, exercise })),
    { type: 'header', title: 'Outros' },
    ...list.others.map((exercise) => ({ type: 'exercise' as const, exercise })),
  ];
}

function selectionLabel(count: number): string {
  if (count === 0) {
    return 'Nenhum exercício selecionado';
  }

  if (count === 1) {
    return '1 exercício selecionado';
  }

  return `${count} exercícios selecionados`;
}

export function ExerciseSelector({
  groups,
  list,
  text,
  muscleGroup,
  selectedIds,
  mode = 'multiple',
  onChangeText,
  onChangeMuscleGroup,
  onToggle,
  onConfirm,
  onCancel,
}: ExerciseSelectorProps) {
  const colors = Colors[resolveScheme(useColorScheme())];
  const insets = useSafeAreaInsets();
  const data = rowsOf(list);
  const selected = new Set(selectedIds);
  const canConfirm = mode === 'single' ? selectedIds.length === 1 : selectedIds.length > 0;
  const fabClearance = insets.bottom + Spacing.md + TouchTarget.min + Spacing.lg;

  return (
    <View style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={(item) => (item.type === 'header' ? item.title : item.exercise.id)}
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingBottom: fabClearance }]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="headline">
              {mode === 'single' ? 'Selecione um exercício' : 'Selecione um ou mais exercícios'}
            </Text>
            <Text variant="subheadline" color="secondaryLabel">
              {mode === 'single'
                ? 'Toque para marcar. Confirmar acrescenta esse exercício.'
                : 'Toque para marcar. Você pode escolher vários antes de confirmar.'}
            </Text>
            <Text>{selectionLabel(selectedIds.length)}</Text>
            <Input
              value={text}
              onChangeText={onChangeText}
              placeholder="Buscar"
              accessibilityLabel="Buscar exercício"
            />
            <View style={styles.filters}>
              {groups.map((group) => (
                <Button
                  key={group.id}
                  variant={muscleGroup === group.name ? 'filled' : 'plain'}
                  onPress={() => onChangeMuscleGroup(muscleGroup === group.name ? undefined : group.name)}>
                  {group.name}
                </Button>
              ))}
            </View>
            <Button variant="plain" onPress={onCancel}>
              Cancelar
            </Button>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text variant="headline">{item.title}</Text>;
          }

          const isSelected = selected.has(item.exercise.id);
          return (
            <ListItem
              title={item.exercise.name}
              subtitle={isSelected ? `${item.exercise.equipment} · Selecionado` : item.exercise.equipment}
              selected={isSelected}
              onPress={() => onToggle(item.exercise.id)}
            />
          );
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Confirmar seleção"
        accessibilityState={{ disabled: !canConfirm }}
        disabled={!canConfirm}
        onPress={onConfirm}
        style={[
          styles.fab,
          {
            backgroundColor: colors.tint,
            bottom: insets.bottom + Spacing.md,
            opacity: canConfirm ? 1 : 0.4,
          },
        ]}>
        <Text color="onTint">Confirmar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    gap: Spacing.sm,
  },
  header: {
    gap: Spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: 0,
    minHeight: TouchTarget.min,
    justifyContent: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
  },
});
