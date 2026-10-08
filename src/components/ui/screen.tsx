import type { ReactNode } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Colors, resolveScheme, Spacing } from '@/constants/theme';

const defaultEdges: Edge[] = ['top', 'left', 'right'];

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
};

export function Screen({ children, edges = defaultEdges }: ScreenProps) {
  const colors = Colors[resolveScheme(useColorScheme())];

  return (
    <SafeAreaView edges={edges} style={[styles.screen, { backgroundColor: colors.groupedBackground }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
});
