import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import { authColors } from '../../constants/auth.constants';

interface PhoneInputProps {
  /** Current phone number value */
  value: string;
  /** Callback when text changes */
  onChangeText: (text: string) => void;
  /** Error message to display below the input */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Phone number input with country code selector.
 *
 * Displays a 🇮🇳 +91 prefix with a numeric text input.
 * Supports focus, error, and disabled visual states.
 */
export default function PhoneInput({
  value,
  onChangeText,
  error,
  disabled = false,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? authColors.inputBorderError
    : isFocused
      ? authColors.inputBorderFocus
      : authColors.inputBorder;

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { borderColor }]}>
        {/* Country Code Selector */}
        <TouchableOpacity
          style={styles.countryCode}
          disabled={disabled}
          accessibilityLabel="Country code selector"
        >
          <Text style={styles.flagEmoji}>🇮🇳</Text>
          <Text style={styles.codeText}>+91</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="98765 43210"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!disabled}
          accessibilityLabel="Phone number input"
        />
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authColors.inputBackground,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  codeText: {
    ...typography.body,
    color: colors.black,
    marginRight: spacing.xs,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.black,
    fontSize: 16,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
