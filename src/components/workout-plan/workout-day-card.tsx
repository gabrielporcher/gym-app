import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NameField } from '@/components/workout-plan/name-field';
import { MuscleTag } from '@/components/workout-plan/muscle-tag';
import { WEEKDAY_LABELS } from '@/components/workout-plan/weekday-strip';
import { Spacing } from '@/constants/theme';
import type { MuscleGroupName } from '@/domain/exercise-catalog';
import type { Weekday } from '@/domain/workout-plan';

type WorkoutDayCardProps = {
  name: string;
  tags: readonly MuscleGroupName[];
  canRemove: boolean;
  destinations: readonly Weekday[];
  moving: boolean;
  onRename: (name: string) => void;
  onRemove: () => void;
  onStartMove: () => void;
  onCancelMove: () => void;
  onMove: (weekday: Weekday) => void;
  onOpenExercises: () => void;
};

export function WorkoutDayCard({
  name,
  tags,
  canRemove,
  destinations,
  moving,
  onRename,
  onRemove,
  onStartMove,
  onCancelMove,
  onMove,
  onOpenExercises,
}: WorkoutDayCardProps) {
  return (
    <Card>
      <View style={styles.content}>
        <NameField key={name} value={name} onCommit={onRename} accessibilityLabel="Nome do dia" />
        {tags.length > 0 ? (
          <View style={styles.tags}>
            {tags.map((group) => (
              <MuscleTag key={group} label={group} group={group} />
            ))}
          </View>
        ) : null}
        <Button variant="plain" onPress={onOpenExercises}>
          Adicionar exercícios
        </Button>
        {moving ? (
          <View style={styles.tags}>
            {destinations.map((weekday) => (
              <Button key={weekday} variant="plain" onPress={() => onMove(weekday)}>
                {WEEKDAY_LABELS[weekday]}
              </Button>
            ))}
            <Button variant="plain" onPress={onCancelMove}>
              Cancelar
            </Button>
          </View>
        ) : null}
        {!moving && destinations.length > 0 ? (
          <Button variant="plain" onPress={onStartMove}>
            Mover
          </Button>
        ) : null}
        {canRemove ? (
          <Button variant="destructive" onPress={onRemove}>
            Excluir
          </Button>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
