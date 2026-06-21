import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../../constants';
import { authColors } from '../../constants/auth.constants';

interface DemoCardProps {
  /** The demo OTP to display */
  otp: string;
}

/**
 * Demo mode information card.
 *
 * Displays the test OTP prominently for client presentations
 * and developer testing. This component should be conditionally
 * rendered only in demo/dev environments in production builds.
 */
export default function DemoCard({ otp }: DemoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="key-outline"
          size={20}
          color={authColors.demoCardText}
        />
        <Text style={styles.title}>Demo Authentication</Text>
      </View>

      <View style={styles.otpContainer}>
        <Text style={styles.label}>OTP for Testing:</Text>
        <Text style={styles.otp}>{otp}</Text>
      </View>

      <Text style={styles.subtitle}>Use this OTP to continue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: authColors.demoCardBg,
    borderWidth: 1,
    borderColor: authColors.demoCardBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodyBold,
    color: authColors.demoCardText,
    marginLeft: spacing.xs,
  },
  otpContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: authColors.demoCardText,
    marginBottom: spacing.xs,
  },
  otp: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: authColors.demoCardText,
    letterSpacing: 8,
  },
  subtitle: {
    ...typography.caption,
    color: authColors.demoCardText,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
