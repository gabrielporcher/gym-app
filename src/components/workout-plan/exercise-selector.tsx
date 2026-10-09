import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListItem } from '@/components/ui/list-item';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
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
  onChangeText: (value: string) => void;
  onChangeMuscleGroup: (value: string | undefined) => void;
  onChoose: (exerciseId: string) => void;
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

export function ExerciseSelector({
  groups,
  list,
  text,
  muscleGroup,
  onChangeText,
  onChangeMuscleGroup,
  onChoose,
  onCancel,
}: ExerciseSelectorProps) {
  const data = rowsOf(list);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => (item.type === 'header' ? item.title : item.exercise.id)}
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <Input value={text} onChangeText={onChangeText} placeholder="Buscar" accessibilityLabel="Buscar exercício" />
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

        return (
          <ListItem
            title={item.exercise.name}
            subtitle={item.exercise.equipment}
            onPress={() => onChoose(item.exercise.id)}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
