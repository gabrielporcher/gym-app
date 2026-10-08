import type { ReactNode } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';

import { Colors, Radius, resolveScheme, Spacing } from '@/constants/theme';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  const colors = Colors[resolveScheme(useColorScheme())];

  if (isGlassEffectAPIAvailable()) {
    return (
      <GlassView glassEffectStyle="regular" style={styles.card}>
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.secondaryGroupedBackground }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
});
