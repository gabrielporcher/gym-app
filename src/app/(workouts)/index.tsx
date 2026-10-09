import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useWorkoutPlanList, type WorkoutPlanList } from '@/hooks/use-workout-plan';

type ListedPlan = NonNullable<WorkoutPlanList['active']>;

function dayNames(plan: ListedPlan): string {
  return plan.days.map((day) => day.name).join(', ');
}

function PlanList({
  plans,
  onReactivate,
  onRemove,
}: {
  plans: WorkoutPlanList;
  onReactivate: (planId: string) => void;
  onRemove: (planId: string) => void;
}) {
  const active = plans.active;
  const empty = !active && plans.archived.length === 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {empty ? <Text>Nenhum plano de treino ainda.</Text> : null}
      {active ? (
        <Card>
          <View style={styles.block}>
            <Text variant="headline">Plano ativo</Text>
            <Text>{active.name}</Text>
            <Text color="secondaryLabel">{dayNames(active)}</Text>
            <Button onPress={() => router.push(`./${active.id}`, { relativeToDirectory: true })}>Abrir</Button>
            <Button variant="destructive" onPress={() => onRemove(active.id)}>
              Excluir
            </Button>
          </View>
        </Card>
      ) : null}
      {plans.archived.map((plan) => (
        <Card key={plan.id}>
          <View style={styles.block}>
            <Text variant="headline">Arquivado</Text>
            <Text>{plan.name}</Text>
            <Text color="secondaryLabel">{dayNames(plan)}</Text>
            <Button variant="plain" onPress={() => onReactivate(plan.id)}>
              Reativar
            </Button>
            <Button variant="destructive" onPress={() => onRemove(plan.id)}>
              Excluir
            </Button>
          </View>
        </Card>
      ))}
      <Button onPress={() => router.push('./new', { relativeToDirectory: true })}>Criar plano</Button>
    </ScrollView>
  );
}

export default function WorkoutsScreen() {
  const { plans, reactivate, remove } = useWorkoutPlanList();

  function confirmReactivate(plan: ListedPlan) {
    const activeName = plans?.active?.name;
    Alert.alert(
      'Reativar plano',
      activeName ? `Arquivar "${activeName}" e reativar "${plan.name}"?` : `Reativar "${plan.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reativar', onPress: () => void reactivate(plan.id) },
      ],
    );
  }

  function confirmRemove(plan: ListedPlan) {
    Alert.alert('Excluir plano', `Excluir "${plan.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void remove(plan.id) },
    ]);
  }

  return (
    <Screen edges={['left', 'right']}>
      {plans ? (
        <PlanList
          plans={plans}
          onReactivate={(planId) => {
            const plan = plans.archived.find((item) => item.id === planId);
            if (plan) {
              confirmReactivate(plan);
            }
          }}
          onRemove={(planId) => {
            const plan = plans.active?.id === planId ? plans.active : plans.archived.find((item) => item.id === planId);
            if (plan) {
              confirmRemove(plan);
            }
          }}
        />
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
  block: {
    gap: Spacing.sm,
  },
});
