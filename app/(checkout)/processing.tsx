import React from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useOrderStore } from '../../src/store/orderStore';
import { ProcessingTracker } from '../../src/components/checkout/ProcessingTracker';
import { colors, spacing, typography } from '../../src/constants';

export default function PaymentProcessingScreen() {
  const processingSteps = useOrderStore((s) => s.processingSteps);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Loading Spinner Header */}
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>

        <Text style={styles.title}>Processing Payment</Text>
        <Text style={styles.subtitle}>Please do not close this screen.</Text>
        <Text style={styles.message}>We are verifying your transaction with Razorpay.</Text>

        {/* Timeline tracker */}
        <View style={styles.trackerWrapper}>
          <ProcessingTracker steps={processingSteps} />
        </View>
      </View>

      {/* Safety Notice Footer */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          ⚠️ This may take a few seconds. Do not press the back button or close the application.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.display,
    fontSize: 22,
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyBold,
    color: colors.blue,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  trackerWrapper: {
    width: '100%',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  noticeBox: {
    backgroundColor: '#FFFBEB', // amber light alert bg
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noticeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#B45309', // amber text
    textAlign: 'center',
    lineHeight: 18,
  },
});
