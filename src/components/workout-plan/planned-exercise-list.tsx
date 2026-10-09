import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import type { ExerciseTarget } from '@/domain/workout-plan';

type PlannedExercise = {
  id: string;
  name: string;
  target: ExerciseTarget;
};

type PlannedExerciseListProps = {
  exercises: readonly PlannedExercise[];
  onMove: (plannedExerciseId: string, direction: 'up' | 'down') => void;
  onCommitTarget: (plannedExerciseId: string, target: ExerciseTarget) => Promise<boolean>;
  onAdd: () => void;
};

function formatWeight(weightKg: number): string {
  const text = Number.isInteger(weightKg) ? String(weightKg) : String(weightKg).replace('.', ',');
  return `${text} kg`;
}

function formatTarget(target: ExerciseTarget): string | null {
  const { sets, repMin, repMax, weightKg } = target;
  const weight = weightKg === null ? null : formatWeight(weightKg);
  if (sets === null && repMin === null && repMax === null) {
    return weight;
  }

  if (sets !== null && repMin === null && repMax === null) {
    return weight ? `${sets} séries, ${weight}` : `${sets} séries`;
  }

  const parts = [sets, repMin, repMax].filter((value): value is number => value !== null);
  let summary: string | null = null;
  if (parts.length === 3) {
    summary = `${parts[0]}, ${parts[1]} e ${parts[2]}`;
  } else if (parts.length === 2) {
    summary = `${parts[0]} e ${parts[1]}`;
  } else if (parts[0] !== undefined) {
    summary = String(parts[0]);
  }

  if (summary && weight) {
    return `${summary}, ${weight}`;
  }

  return summary ?? weight;
}

function parseWeight(value: string): number | null | undefined {
  const trimmed = value.trim().replace(',', '.');
  if (trimmed === '') {
    return null;
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return undefined;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function parseCount(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }

  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }

  return Number(trimmed);
}

function TargetEditor({
  target,
  onCommit,
}: {
  target: ExerciseTarget;
  onCommit: (target: ExerciseTarget) => Promise<boolean>;
}) {
  const [sets, setSets] = useState(target.sets?.toString() ?? '');
  const [repMin, setRepMin] = useState(target.repMin?.toString() ?? '');
  const [repMax, setRepMax] = useState(target.repMax?.toString() ?? '');
  const [weightKg, setWeightKg] = useState(target.weightKg === null ? '' : formatWeight(target.weightKg).replace(' kg', ''));
  const summary = formatTarget(target);

  function reset() {
    setSets(target.sets?.toString() ?? '');
    setRepMin(target.repMin?.toString() ?? '');
    setRepMax(target.repMax?.toString() ?? '');
    setWeightKg(target.weightKg === null ? '' : formatWeight(target.weightKg).replace(' kg', ''));
  }

  async function commit() {
    const parsedSets = parseCount(sets);
    const parsedMin = parseCount(repMin);
    const parsedMax = parseCount(repMax);
    const parsedWeight = parseWeight(weightKg);
    if (
      parsedSets === undefined ||
      parsedMin === undefined ||
      parsedMax === undefined ||
      parsedWeight === undefined
    ) {
      reset();
      return;
    }

    const accepted = await onCommit({
      sets: parsedSets,
      repMin: parsedMin,
      repMax: parsedMax,
      weightKg: parsedWeight,
    });
    if (!accepted) {
      reset();
    }
  }

  return (
    <View style={styles.targets}>
      {summary ? <Text>{summary}</Text> : null}
      <Input
        value={sets}
        onChangeText={setSets}
        placeholder="Séries"
        accessibilityLabel="Séries"
        keyboardType="number-pad"
      />
      <Input
        value={repMin}
        onChangeText={setRepMin}
        placeholder="Mínimo"
        accessibilityLabel="Repetições mínimas"
        keyboardType="number-pad"
      />
      <Input
        value={repMax}
        onChangeText={setRepMax}
        placeholder="Máximo"
        accessibilityLabel="Repetições máximas"
        keyboardType="number-pad"
      />
      <Input
        value={weightKg}
        onChangeText={setWeightKg}
        placeholder="Peso (kg)"
        accessibilityLabel="Peso em quilogramas"
        keyboardType="decimal-pad"
      />
      <Button variant="plain" onPress={commit}>
        Gravar meta
      </Button>
    </View>
  );
}

export function PlannedExerciseList({ exercises, onMove, onCommitTarget, onAdd }: PlannedExerciseListProps) {
  return (
    <View style={styles.list}>
      {exercises.map((exercise, index) => (
        <Card key={exercise.id}>
          <View style={styles.exercise}>
            <Text>{exercise.name}</Text>
            <TargetEditor
              key={`${exercise.target.sets ?? ''}-${exercise.target.repMin ?? ''}-${exercise.target.repMax ?? ''}-${exercise.target.weightKg ?? ''}`}
              target={exercise.target}
              onCommit={(target) => onCommitTarget(exercise.id, target)}
            />
            <View style={styles.moves}>
              {index > 0 ? (
                <Button variant="plain" onPress={() => onMove(exercise.id, 'up')}>
                  Subir
                </Button>
              ) : null}
              {index < exercises.length - 1 ? (
                <Button variant="plain" onPress={() => onMove(exercise.id, 'down')}>
                  Descer
                </Button>
              ) : null}
            </View>
          </View>
        </Card>
      ))}
      <Button onPress={onAdd}>Adicionar exercício</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  exercise: {
    gap: Spacing.sm,
  },
  targets: {
    gap: Spacing.sm,
  },
  moves: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
