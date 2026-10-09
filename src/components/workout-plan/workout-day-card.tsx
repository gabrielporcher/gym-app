import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NameField } from '@/components/workout-plan/name-field';
import { MuscleTag } from '@/components/workout-plan/muscle-tag';
import { WEEKDAY_LABELS } from '@/components/workout-plan/weekday-strip';
import { Spacing } from '@/constants/theme';
import { MUSCLE_GROUP_NAMES, type MuscleGroupName } from '@/domain/exercise-catalog';
import type { DayEmphasis, Weekday } from '@/domain/workout-plan';

type WorkoutDayCardProps = {
  name: string;
  emphasis: DayEmphasis;
  canRemove: boolean;
  destinations: readonly Weekday[];
  moving: boolean;
  onRename: (name: string) => void;
  onRemove: () => void;
  onStartMove: () => void;
  onCancelMove: () => void;
  onMove: (weekday: Weekday) => void;
  onAddGroup: (group: MuscleGroupName) => void;
  onRemoveGroup: (group: MuscleGroupName) => void;
  onRemoveFullBody: () => void;
  onOpenExercises: () => void;
};

export function WorkoutDayCard({
  name,
  emphasis,
  canRemove,
  destinations,
  moving,
  onRename,
  onRemove,
  onStartMove,
  onCancelMove,
  onMove,
  onAddGroup,
  onRemoveGroup,
  onRemoveFullBody,
  onOpenExercises,
}: WorkoutDayCardProps) {
  const currentGroups = emphasis.mode === 'groups' ? emphasis.groups : [];
  const availableGroups = MUSCLE_GROUP_NAMES.filter((group) => !currentGroups.includes(group));

  return (
    <Card>
      <View style={styles.content}>
        <NameField key={name} value={name} onCommit={onRename} accessibilityLabel="Nome do dia" />
        <View style={styles.tags}>
          {emphasis.mode === 'full-body' ? (
            <MuscleTag label="Corpo inteiro" onRemove={onRemoveFullBody} />
          ) : (
            currentGroups.map((group) => (
              <MuscleTag key={group} label={group} group={group} onRemove={() => onRemoveGroup(group)} />
            ))
          )}
        </View>
        {availableGroups.length > 0 ? (
          <View style={styles.tags}>
            {availableGroups.map((group) => (
              <Button key={group} variant="plain" onPress={() => onAddGroup(group)}>
                {`Adicionar ${group}`}
              </Button>
            ))}
          </View>
        ) : null}
        <Button variant="plain" onPress={onOpenExercises}>
          Exercícios
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
            Remover
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
