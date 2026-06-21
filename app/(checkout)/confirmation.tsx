import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrderStore } from '../../src/store/orderStore';
import { colors, spacing, typography } from '../../src/constants';

// Checkout Components
import { ConfirmationHeader } from '../../src/components/checkout/ConfirmationHeader';
import { OrderSummaryCard } from '../../src/components/checkout/OrderSummaryCard';
import { CartToast } from '../../src/components/common/CartToast';

export default function OrderConfirmationScreen() {
  const router = useRouter();

  // Zustand State
  const confirmedOrder = useOrderStore((s) => s.confirmedOrder);
  const clearOrder = useOrderStore((s) => s.clearOrder);

  // Local Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!confirmedOrder) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No completed order found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/store')}>
          <Text style={styles.backBtnText}>Go to Store</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCopyOrderId = () => {
    setToastMessage('Order ID copied to clipboard!');
    setToastVisible(true);
  };

  const handleTrackOrder = () => {
    setToastMessage('Order tracking coming in Phase 6!');
    setToastVisible(true);
  };

  const handleContinueShopping = () => {
    clearOrder(); // clear temporary checkout order state
    router.push('/(tabs)/store');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Animated Check Circle and Order ID Header */}
        <ConfirmationHeader
          orderId={confirmedOrder.id}
          displayOrderId={confirmedOrder.displayOrderId}
          onCopyOrderId={handleCopyOrderId}
        />

        {/* Success Alert Pill */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            📧 You'll receive an email and SMS with order details and tracking instructions shortly.
          </Text>
        </View>

        {/* Pricing Invoices Card */}
        <Text style={styles.summaryTitle}>Payment Details</Text>
        <OrderSummaryCard pricing={confirmedOrder.pricing} showDeliveryNote={false} />
      </ScrollView>

      {/* Checkout Success Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleTrackOrder} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleContinueShopping} activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>

      {/* Clipboard / Tracker Toast */}
      <CartToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    ...typography.bodyBold,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backBtnText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  alertBox: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.blue,
    lineHeight: 18,
  },
  summaryTitle: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
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
});
