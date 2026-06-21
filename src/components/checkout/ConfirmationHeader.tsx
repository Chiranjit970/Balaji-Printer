import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, typography } from '../../constants';

interface ConfirmationHeaderProps {
  orderId: string;
  displayOrderId: string;
  onCopyOrderId: () => void;
}

export const ConfirmationHeader: React.FC<ConfirmationHeaderProps> = ({
  displayOrderId,
  onCopyOrderId,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Elastic pop animation for the green success circle
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 80,
        friction: 5,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        useNativeDriver: true,
      }),
      // Fade in the checkmark
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, checkOpacity]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(displayOrderId);
    onCopyOrderId();
  };

  return (
    <View style={styles.container}>
      {/* Animated Success Check Circle */}
      <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={{ opacity: checkOpacity }}>
          <Ionicons name="checkmark" size={48} color={colors.white} />
        </Animated.View>
      </Animated.View>

      <Text style={styles.title}>Order Confirmed</Text>
      <Text style={styles.subtitle}>Thank You!</Text>
      <Text style={styles.message}>
        Your order has been placed successfully. You will receive email/SMS confirmations shortly.
      </Text>

      {/* Copyable Order ID Container */}
      <View style={styles.orderIdCard}>
        <Text style={styles.orderIdLabel}>ORDER ID</Text>
        <View style={styles.orderIdRow}>
          <Text style={styles.orderIdText}>{displayOrderId}</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton} activeOpacity={0.6}>
            <Ionicons name="copy-outline" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    ...typography.display,
    fontSize: 24,
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.h2,
    color: colors.success,
    fontFamily: 'Inter-Bold',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  orderIdCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minWidth: 180,
  },
  orderIdLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orderIdText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.blue,
  },
  copyButton: {
    padding: spacing.xs,
  },
});
