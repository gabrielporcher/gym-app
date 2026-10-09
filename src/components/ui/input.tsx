import { StyleSheet, TextInput, useColorScheme, type TextInputProps } from 'react-native';

import { Colors, Radius, resolveScheme, Spacing, TouchTarget, Typography } from '@/constants/theme';

type InputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onEndEditing?: TextInputProps['onEndEditing'];
  placeholder?: string;
  accessibilityLabel?: string;
  keyboardType?: TextInputProps['keyboardType'];
};

export function Input({
  value,
  onChangeText,
  onEndEditing,
  placeholder,
  accessibilityLabel,
  keyboardType,
}: InputProps) {
  const colors = Colors[resolveScheme(useColorScheme())];

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      placeholder={placeholder}
      placeholderTextColor={colors.tertiaryLabel}
      accessibilityLabel={accessibilityLabel}
      keyboardType={keyboardType}
      style={[
        styles.input,
        Typography.body,
        {
          color: colors.label,
          backgroundColor: colors.secondaryGroupedBackground,
          borderColor: colors.separator,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: TouchTarget.min,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
});
