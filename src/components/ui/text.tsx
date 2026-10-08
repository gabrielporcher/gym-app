import { Text as RNText, useColorScheme, type TextProps as RNTextProps } from 'react-native';

import {
  Colors,
  resolveScheme,
  Typography,
  type ColorName,
  type TypographyVariant,
} from '@/constants/theme';

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorName;
};

export function Text({ variant = 'body', color = 'label', style, ...props }: TextProps) {
  const scheme = resolveScheme(useColorScheme());

  return (
    <RNText style={[Typography[variant], { color: Colors[scheme][color] }, style]} {...props} />
  );
}
