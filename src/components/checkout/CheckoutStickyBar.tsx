import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants';

interface CheckoutStickyBarProps {
  primaryLabel: string;
  primarySubtext?: string;
  onPrimaryPress: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
}

export const CheckoutStickyBar: React.FC<CheckoutStickyBarProps> = ({
  primaryLabel,
  primarySubtext,
  onPrimaryPress,
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel,
  onSecondaryPress,
}) => {
  const insets = useSafeAreaInsets();
  const isDisabled = primaryDisabled || primaryLoading;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      {/* Primary Filled Button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          isDisabled && styles.primaryButtonDisabled,
        ]}
        onPress={onPrimaryPress}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {primaryLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <View style={styles.primaryButtonContent}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
            {primarySubtext && (
              <Text style={styles.primarySubtextText}>{primarySubtext}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Secondary Text Link */}
      {secondaryLabel && onSecondaryPress && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSecondaryPress}
          activeOpacity={0.6}
          disabled={primaryLoading}
        >
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    // Soft shadow above sticky bar
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  primaryButton: {
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.55,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  primaryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.white,
  },
  primarySubtextText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.white,
    position: 'absolute',
    right: spacing.sm,
  },
  secondaryButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.blue,
  },
});
