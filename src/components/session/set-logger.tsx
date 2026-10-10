import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import type { RecordedSet, SessionExerciseTarget, SetDraft } from '@/domain/session';

type SetLoggerProps = {
  target: SessionExerciseTarget;
  sets: readonly RecordedSet[];
  suggested: SetDraft;
  editable: boolean;
  onSaveDraft: (reps: string, weightKg: string) => Promise<boolean>;
  onSaveSet: (setId: string, reps: string, weightKg: string) => Promise<boolean>;
  onRemoveSet: (setId: string) => Promise<boolean>;
};

function formatKg(weightKg: number): string {
  const text = Number.isInteger(weightKg) ? String(weightKg) : String(weightKg).replace('.', ',');
  return `${text} kg`;
}

function formatWeightInput(weightKg: number): string {
  return Number.isInteger(weightKg) ? String(weightKg) : String(weightKg).replace('.', ',');
}

export function formatSessionTarget(target: SessionExerciseTarget): string | null {
  const parts: string[] = [];
  if (target.sets !== null) {
    parts.push(String(target.sets));
  }
  if (target.repMin !== null) {
    parts.push(String(target.repMin));
  }
  if (target.repMax !== null) {
    parts.push(String(target.repMax));
  }
  if (target.weightKg !== null) {
    parts.push(formatKg(target.weightKg));
  }
  if (parts.length === 0) {
    return null;
  }
  if (parts.length === 1) {
    return parts[0] ?? null;
  }

  const last = parts[parts.length - 1];
  return `${parts.slice(0, -1).join(', ')} e ${last}`;
}

function formatPerformed(set: RecordedSet): string {
  return `${set.reps} e ${formatKg(set.weightKg)}`;
}

function RecordedSetRow({
  set,
  editable,
  onSave,
  onRemove,
}: {
  set: RecordedSet;
  editable: boolean;
  onSave: (setId: string, reps: string, weightKg: string) => Promise<boolean>;
  onRemove: (setId: string) => Promise<boolean>;
}) {
  const [reps, setReps] = useState(String(set.reps));
  const [weightKg, setWeightKg] = useState(formatWeightInput(set.weightKg));

  async function save() {
    const accepted = await onSave(set.id, reps, weightKg);
    if (!accepted) {
      setReps(String(set.reps));
      setWeightKg(formatWeightInput(set.weightKg));
    }
  }

  if (!editable) {
    return (
      <View style={styles.set}>
        <Text>{`Série ${set.position}`}</Text>
        <Text>{formatPerformed(set)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.set}>
      <Text>{`Série ${set.position}`}</Text>
      <Text>{formatPerformed(set)}</Text>
      <Input
        value={reps}
        onChangeText={setReps}
        placeholder="Repetições"
        accessibilityLabel={`Repetições da série ${set.position}`}
        keyboardType="number-pad"
      />
      <Input
        value={weightKg}
        onChangeText={setWeightKg}
        placeholder="Peso (kg)"
        accessibilityLabel={`Peso da série ${set.position}`}
        keyboardType="decimal-pad"
      />
      <Button variant="plain" onPress={() => void save()}>
        Gravar
      </Button>
      <Button variant="destructive" onPress={() => void onRemove(set.id)}>
        Remover
      </Button>
    </View>
  );
}

function DraftSet({
  position,
  suggested,
  onSave,
}: {
  position: number;
  suggested: SetDraft;
  onSave: (reps: string, weightKg: string) => Promise<boolean>;
}) {
  const [reps, setReps] = useState(suggested.reps);
  const [weightKg, setWeightKg] = useState(suggested.weightKg);

  return (
    <View style={styles.set}>
      <Text>{`Série ${position}`}</Text>
      <Input
        value={reps}
        onChangeText={setReps}
        placeholder="Repetições"
        accessibilityLabel="Repetições da próxima série"
        keyboardType="number-pad"
      />
      <Input
        value={weightKg}
        onChangeText={setWeightKg}
        placeholder="Peso (kg)"
        accessibilityLabel="Peso da próxima série"
        keyboardType="decimal-pad"
      />
      <Button variant="plain" onPress={() => void onSave(reps, weightKg)}>
        Gravar série
      </Button>
    </View>
  );
}

export function SetLogger({
  target,
  sets,
  suggested,
  editable,
  onSaveDraft,
  onSaveSet,
  onRemoveSet,
}: SetLoggerProps) {
  const targetLabel = formatSessionTarget(target);
  const signature = `${suggested.reps}|${suggested.weightKg}|${sets.map((set) => `${set.id}:${set.reps}:${set.weightKg}`).join(',')}`;

  return (
    <View style={styles.list}>
      {targetLabel ? <Text>{targetLabel}</Text> : null}
      {sets.map((set) => (
        <RecordedSetRow
          key={`${set.id}-${set.reps}-${set.weightKg}`}
          set={set}
          editable={editable}
          onSave={onSaveSet}
          onRemove={onRemoveSet}
        />
      ))}
      {editable ? (
        <DraftSet
          key={signature}
          position={sets.length + 1}
          suggested={suggested}
          onSave={onSaveDraft}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  set: {
    gap: Spacing.sm,
  },
});
