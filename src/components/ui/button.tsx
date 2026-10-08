import { Pressable, StyleSheet, useColorScheme } from 'react-native';

import { Text } from '@/components/ui/text';
import {
  Colors,
  Radius,
  resolveScheme,
  Spacing,
  TouchTarget,
  type ColorName,
} from '@/constants/theme';

type ButtonVariant = 'filled' | 'plain' | 'destructive';

type ButtonProps = {
  variant?: ButtonVariant;
  onPress?: () => void;
  children: string;
};

const labelColor: Record<ButtonVariant, ColorName> = {
  filled: 'onTint',
  plain: 'tint',
  destructive: 'destructive',
};

export function Button({ variant = 'filled', onPress, children }: ButtonProps) {
  const colors = Colors[resolveScheme(useColorScheme())];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.base,
        variant === 'filled' ? styles.filled : styles.plain,
        variant === 'filled' ? { backgroundColor: colors.tint } : null,
      ]}>
      <Text color={labelColor[variant]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  filled: {
    borderRadius: Radius.full,
  },
  plain: {
    backgroundColor: 'transparent',
  },
});
