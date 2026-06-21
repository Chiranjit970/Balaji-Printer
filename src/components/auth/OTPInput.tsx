import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, spacing } from '../../constants';
import { authColors, authConfig } from '../../constants/auth.constants';

interface OTPInputProps {
  /** Current OTP value string */
  value: string;
  /** Callback when OTP changes */
  onChangeText: (text: string) => void;
  /** Show error styling on all boxes */
  error?: boolean;
  /** Disable all inputs */
  disabled?: boolean;
  /** Called when all digits are entered */
  onComplete?: (otp: string) => void;
}

/**
 * Custom 6-box OTP entry component.
 *
 * Features:
 * - Auto-focus to next box on digit entry
 * - Auto-focus to previous box on backspace
 * - Clipboard paste support (distributes digits across boxes)
 * - Error state (red borders)
 * - Focus animation (blue border)
 */
export default function OTPInput({
  value,
  onChangeText,
  error = false,
  disabled = false,
  onComplete,
}: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = value.split('').concat(
    Array(authConfig.otpLength - value.length).fill('')
  ).slice(0, authConfig.otpLength);

  // Focus first empty box on mount
  useEffect(() => {
    if (!disabled) {
      const firstEmpty = digits.findIndex((d) => d === '');
      const targetIndex = firstEmpty === -1 ? 0 : firstEmpty;
      setTimeout(() => {
        inputRefs.current[targetIndex]?.focus();
      }, 100);
    }
  }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste (multi-character input)
      if (text.length > 1) {
        const pastedDigits = text.replace(/\D/g, '').slice(0, authConfig.otpLength);
        if (pastedDigits.length > 0) {
          onChangeText(pastedDigits);
          // Focus last filled box or the box after pasted content
          const focusIndex = Math.min(
            pastedDigits.length,
            authConfig.otpLength - 1
          );
          setTimeout(() => {
            inputRefs.current[focusIndex]?.focus();
          }, 50);
          if (pastedDigits.length === authConfig.otpLength) {
            onComplete?.(pastedDigits);
          }
          return;
        }
      }

      // Handle single digit entry
      const digit = text.replace(/\D/g, '');
      if (digit.length <= 1) {
        const newDigits = [...digits];
        newDigits[index] = digit;
        const newValue = newDigits.join('');
        onChangeText(newValue);

        // Auto-focus next box
        if (digit && index < authConfig.otpLength - 1) {
          inputRefs.current[index + 1]?.focus();
        }

        // Fire onComplete when all digits entered
        if (digit && newValue.replace(/\s/g, '').length === authConfig.otpLength) {
          onComplete?.(newValue);
        }
      }
    },
    [digits, onChangeText, onComplete]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          // Current box empty — move to previous and clear it
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          onChangeText(newDigits.join(''));
          inputRefs.current[index - 1]?.focus();
        } else {
          // Clear current box
          const newDigits = [...digits];
          newDigits[index] = '';
          onChangeText(newDigits.join(''));
        }
      }
    },
    [digits, onChangeText]
  );

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => {
        const isFilled = digit !== '';
        const boxBorderColor = error
          ? colors.danger
          : isFilled
            ? authColors.otpBoxBorderActive
            : authColors.otpBoxBorder;
        const boxBg = error
          ? '#FEF2F2'
          : isFilled
            ? authColors.otpBoxFilled
            : authColors.otpBoxInactive;

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.box,
              {
                borderColor: boxBorderColor,
                backgroundColor: boxBg,
              },
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={Platform.OS === 'web' ? 6 : 1}
            editable={!disabled}
            selectTextOnFocus
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
    gap: 8,
  },
  box: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
});
