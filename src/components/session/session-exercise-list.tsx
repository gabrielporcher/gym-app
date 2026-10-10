import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/ui/list-item';
import { Spacing, type ColorName } from '@/constants/theme';
import type { SessionExerciseState } from '@/domain/session';

type SessionExerciseRow = {
  id: string;
  name: string;
  state: SessionExerciseState;
  sets: readonly { id: string }[];
};

type SessionExerciseListProps = {
  exercises: readonly SessionExerciseRow[];
  editable: boolean;
  onOpen: (sessionExerciseId: string) => void;
  onRemove: (exercise: SessionExerciseRow) => void;
};

const stateLabel: Record<SessionExerciseState, string> = {
  'not-started': 'Não iniciado',
  'in-progress': 'Em andamento',
  completed: 'Concluído',
};

const stateColor: Record<SessionExerciseState, ColorName> = {
  'not-started': 'secondaryLabel',
  'in-progress': 'label',
  completed: 'tint',
};

export function SessionExerciseList({ exercises, editable, onOpen, onRemove }: SessionExerciseListProps) {
  return (
    <View style={styles.list}>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.row}>
          <ListItem
            title={exercise.name}
            subtitle={stateLabel[exercise.state]}
            titleColor={stateColor[exercise.state]}
            showChevron
            onPress={() => onOpen(exercise.id)}
          />
          {editable ? (
            <Button variant="destructive" onPress={() => onRemove(exercise)}>
              Remover
            </Button>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  row: {
    gap: Spacing.xs,
  },
});
