import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Colors, resolveScheme, Spacing, TouchTarget } from '@/constants/theme';

type ListItemProps = {
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, showChevron = false, onPress }: ListItemProps) {
  const colors = Colors[resolveScheme(useColorScheme())];
  const content = (
    <>
      <View style={styles.copy}>
        <Text>{title}</Text>
        {subtitle ? (
          <Text variant="subheadline" color="secondaryLabel">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showChevron ? <Text color="tertiaryLabel">›</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.row, { backgroundColor: colors.secondaryGroupedBackground, borderBottomColor: colors.separator }]}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, { backgroundColor: colors.secondaryGroupedBackground, borderBottomColor: colors.separator }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TouchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
});
