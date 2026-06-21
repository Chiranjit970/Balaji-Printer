import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, spacing, typography } from '../../constants';
import { authColors } from '../../constants/auth.constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label above the input */
  label?: string;
  /** Error message below the input */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Base text input component with label, error, and focus states.
 * Designed for reuse across the app (auth, profile, etc.).
 */
export default function Input({
  label,
  error,
  disabled = false,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? authColors.inputBorderError
    : isFocused
      ? authColors.inputBorderFocus
      : authColors.inputBorder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          { borderColor },
          disabled && styles.inputDisabled,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        placeholderTextColor={colors.textMuted}
        {...textInputProps}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    color: colors.black,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.7,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
