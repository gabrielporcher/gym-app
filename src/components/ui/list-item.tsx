import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Colors, resolveScheme, Spacing, TouchTarget, type ColorName } from '@/constants/theme';

type ListItemProps = {
  title: string;
  subtitle?: string;
  titleColor?: ColorName;
  showChevron?: boolean;
  selected?: boolean;
  onPress?: () => void;
};

export function ListItem({
  title,
  subtitle,
  titleColor,
  showChevron = false,
  selected = false,
  onPress,
}: ListItemProps) {
  const colors = Colors[resolveScheme(useColorScheme())];
  const resolvedTitleColor = selected ? 'onTint' : (titleColor ?? 'label');
  const subtitleColor = selected ? 'onTint' : 'secondaryLabel';
  const content = (
    <>
      <View style={styles.copy}>
        <Text color={resolvedTitleColor}>{title}</Text>
        {subtitle ? (
          <Text variant="subheadline" color={subtitleColor}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {selected ? <Text color="onTint">✓</Text> : null}
      {showChevron ? <Text color="tertiaryLabel">›</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={[
          styles.row,
          {
            backgroundColor: selected ? colors.tint : colors.secondaryGroupedBackground,
            borderBottomColor: colors.separator,
          },
        ]}>
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
