import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Colors, MuscleGroupColors, Radius, resolveScheme, Spacing, TouchTarget } from '@/constants/theme';
import type { MuscleGroupName } from '@/domain/exercise-catalog';

type MuscleTagProps = {
  label: string;
  group?: MuscleGroupName;
  onRemove?: () => void;
};

function channel(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(left: number, right: number): number {
  const lighter = Math.max(left, right);
  const darker = Math.min(left, right);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableColor(background: string, label: string, onTint: string): string {
  const backgroundLuminance = luminance(background);
  const labelContrast = contrast(backgroundLuminance, luminance(label));
  const onTintContrast = contrast(backgroundLuminance, luminance(onTint));
  if (Math.max(labelContrast, onTintContrast) >= 4.5) {
    return labelContrast >= onTintContrast ? label : onTint;
  }

  const blackContrast = contrast(backgroundLuminance, 0);
  const whiteContrast = contrast(backgroundLuminance, 1);
  return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
}

export function MuscleTag({ label, group, onRemove }: MuscleTagProps) {
  const scheme = resolveScheme(useColorScheme());
  const colors = Colors[scheme];
  const background = group ? MuscleGroupColors[group][scheme] : colors.tint;
  const textColor = readableColor(background, colors.label, colors.onTint);
  const content = (
    <Text variant="caption1" style={{ color: textColor }}>
      {label}
    </Text>
  );

  if (!onRemove) {
    return <View style={[styles.tag, { backgroundColor: background }]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Remover ${label}`}
      onPress={onRemove}
      style={[styles.tag, { backgroundColor: background }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    minHeight: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
  },
});
