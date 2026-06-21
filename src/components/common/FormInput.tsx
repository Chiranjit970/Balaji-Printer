import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { colors, spacing, typography } from '../../constants';

interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  error,
  required = false,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  value,
  onChangeText,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        onFocus={() => setIsFocused(true)}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  asterisk: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  multilineInput: {
    height: 72,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.blue,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.danger,
    marginTop: 4,
  },
});
