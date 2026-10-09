import { StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Colors, Radius, resolveScheme, Spacing } from '@/constants/theme';
import { WEEKDAYS, type Weekday } from '@/domain/workout-plan';

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
  7: 'Dom',
};

type WeekdayStripProps = {
  days: readonly { name: string; weekday: Weekday }[];
};

export function WeekdayStrip({ days }: WeekdayStripProps) {
  const colors = Colors[resolveScheme(useColorScheme())];

  return (
    <View style={styles.row}>
      {WEEKDAYS.map((weekday) => {
        const day = days.find((item) => item.weekday === weekday);
        return (
          <View
            key={weekday}
            style={[styles.cell, { backgroundColor: colors.secondaryGroupedBackground }]}>
            <Text variant="caption2" color="secondaryLabel">
              {WEEKDAY_LABELS[weekday]}
            </Text>
            <Text variant="caption2">{day ? day.name : 'Descanso'}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.sm,
    padding: Spacing.xs,
  },
});
