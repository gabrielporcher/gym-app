import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Colors, resolveScheme } from '@/constants/theme';
import { useLocalDatabase } from '@/hooks/use-local-database';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function RootLayout() {
  const status = useLocalDatabase();
  const tint = Colors[resolveScheme(useColorScheme())].tint;

  useEffect(() => {
    if (status !== 'pending') {
      SplashScreen.hideAsync();
    }
  }, [status]);

  if (status === 'pending') {
    return null;
  }

  if (status === 'error') {
    return (
      <Screen>
        <Text>Não foi possível preparar o armazenamento deste aparelho.</Text>
      </Screen>
    );
  }

  return (
    <NativeTabs labelVisibilityMode="labeled" tintColor={tint}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(workouts)">
        <NativeTabs.Trigger.Label>Treinos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'dumbbell', selected: 'dumbbell.fill' }}
          md="fitness_center"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(dashboard)">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
