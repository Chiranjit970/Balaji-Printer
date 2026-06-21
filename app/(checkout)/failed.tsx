import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrderStore } from '../../src/store/orderStore';
import { colors, spacing, typography } from '../../src/constants';

export default function PaymentFailedScreen() {
  const router = useRouter();

  // Zustand State
  const paymentError = useOrderStore((s) => s.paymentError);
  const resetProcessingSteps = useOrderStore((s) => s.resetProcessingSteps);
  const setPaymentError = useOrderStore((s) => s.setPaymentError);

  const handleTryAgain = () => {
    resetProcessingSteps();
    setPaymentError(null);
    router.replace('/(checkout)/payment');
  };

  const handleBackToReview = () => {
    resetProcessingSteps();
    setPaymentError(null);
    router.replace('/(checkout)/review');
  };

  const handleReturnToCart = () => {
    resetProcessingSteps();
    setPaymentError(null);
    router.replace('/(checkout)/cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Error icon circle */}
        <View style={styles.errorCircle}>
          <Ionicons name="close" size={48} color={colors.white} />
        </View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.message}>
          We couldn't complete your transaction. No money has been deducted.
        </Text>

        {/* Display payment gateway error description */}
        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>REASON</Text>
          <Text style={styles.reasonText}>
            {paymentError || 'An unknown network error occurred. Please try again.'}
          </Text>
        </View>
      </View>

      {/* Checkout Recovery Action CTAs */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleTryAgain} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleBackToReview} activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>Back to Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textBtn} onPress={handleReturnToCart} activeOpacity={0.6}>
          <Text style={styles.textBtnText}>Return to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  errorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    ...typography.display,
    fontSize: 22,
    color: colors.black,
    marginBottom: 4,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  reasonCard: {
    backgroundColor: '#FEF2F2', // light red reason card bg
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  reasonLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#B91C1C',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.blue,
  },
  textBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  textBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
});
