import type { ColorSchemeName, TextStyle } from 'react-native';

import type { MuscleGroupName } from '@/domain/exercise-catalog';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const TouchTarget = {
  min: 44,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

type TextRole = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
};

export const Typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: FontWeight.regular },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: FontWeight.regular },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: FontWeight.regular },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: FontWeight.regular },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: FontWeight.semibold },
  body: { fontSize: 17, lineHeight: 22, fontWeight: FontWeight.regular },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: FontWeight.regular },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: FontWeight.regular },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: FontWeight.regular },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: FontWeight.regular },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: FontWeight.regular },
} as const satisfies Record<string, TextRole>;

export type TypographyVariant = keyof typeof Typography;

export const Colors = {
  light: {
    background: '#FFFFFF',
    groupedBackground: '#F2F2F7',
    secondaryGroupedBackground: '#FFFFFF',
    label: '#000000',
    secondaryLabel: 'rgba(60,60,67,0.6)',
    tertiaryLabel: 'rgba(60,60,67,0.3)',
    separator: 'rgba(60,60,67,0.29)',
    tint: '#007AFF',
    destructive: '#FF3B30',
    onTint: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    groupedBackground: '#000000',
    secondaryGroupedBackground: '#1C1C1E',
    label: '#FFFFFF',
    secondaryLabel: 'rgba(235,235,245,0.6)',
    tertiaryLabel: 'rgba(235,235,245,0.3)',
    separator: 'rgba(84,84,88,0.65)',
    tint: '#0A84FF',
    destructive: '#FF453A',
    onTint: '#FFFFFF',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorName = keyof typeof Colors.light;

export const MuscleGroupColors = {
  Peito: { light: '#D92D20', dark: '#FF7A70' },
  Costas: { light: '#175CD3', dark: '#84ADFF' },
  Ombros: { light: '#DC6803', dark: '#FDB022' },
  Bíceps: { light: '#088AB2', dark: '#22CCEE' },
  Tríceps: { light: '#6941C6', dark: '#B692F6' },
  Antebraço: { light: '#667085', dark: '#98A2B3' },
  Quadríceps: { light: '#079455', dark: '#47CD89' },
  'Posterior de coxa': { light: '#0E9384', dark: '#2ED3B7' },
  Glúteos: { light: '#DD2590', dark: '#F670C7' },
  Adutores: { light: '#444CE7', dark: '#A4BCFD' },
  Panturrilhas: { light: '#669F2A', dark: '#ACDC79' },
  Abdômen: { light: '#CA8504', dark: '#FDE272' },
} as const satisfies Record<MuscleGroupName, { readonly light: string; readonly dark: string }>;

export function resolveScheme(scheme: ColorSchemeName): ColorScheme {
  return scheme === 'dark' ? 'dark' : 'light';
}
