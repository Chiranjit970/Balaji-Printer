import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../../constants';

type ButtonVariant = 'primary' | 'secondary' | 'text';

interface ButtonProps {
  /** Button label text */
  title: string;
  /** Press handler */
  onPress: () => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Show spinner and disable interaction */
  loading?: boolean;
  /** Disable interaction without loading spinner */
  disabled?: boolean;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * Reusable button matching the design system.
 * Supports primary (filled), secondary (outlined), and text variants.
 * Minimum 44dp touch target for accessibility.
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant].container,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.blue}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variantStyles[variant].label,
            isDisabled && styles.disabledLabel,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledLabel: {
    opacity: 0.7,
  },
});

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; label: TextStyle }
> = {
  primary: {
    container: {
      backgroundColor: colors.blue,
    },
    label: {
      color: colors.white,
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.black,
    },
    label: {
      color: colors.black,
    },
  },
  text: {
    container: {
      backgroundColor: 'transparent',
      paddingHorizontal: spacing.sm,
    },
    label: {
      color: colors.blue,
    },
  },
};
