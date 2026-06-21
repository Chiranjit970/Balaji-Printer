import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrderStore } from '../../src/store/orderStore';
import { usePayment } from '../../src/hooks/usePayment';
import { MOCK_PAYMENT_METHODS } from '../../src/constants/checkout.constants';
import { colors, spacing, typography } from '../../src/constants';

// Checkout Components
import { PaymentMethodCard } from '../../src/components/checkout/PaymentMethodCard';
import { PaymentMethod } from '../../src/types/order.types';

export default function MockPaymentScreen() {
  const router = useRouter();

  // Zustand State
  const pendingOrder = useOrderStore((s) => s.pendingOrder);
  const setPaymentError = useOrderStore((s) => s.setPaymentError);

  // Hook State
  const { executePayment } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  if (!pendingOrder) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No order found to pay for.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCancelPayment = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment? Your order will not be placed.',
      [
        { text: 'No, Keep Paying', style: 'default' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setPaymentError('Payment was cancelled by user.');
            router.replace('/(checkout)/failed');
          },
        },
      ]
    );
  };

  const handlePayNow = () => {
    executePayment(selectedMethod);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Razorpay Top Header Row */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelPayment} style={styles.cancelButton} activeOpacity={0.6}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitle}>Razorpay</Text>
        <Ionicons name="shield-checkmark" size={18} color="#0B2F64" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Merchant Info Block */}
        <View style={styles.merchantCard}>
          <View style={styles.merchantHeader}>
            <View style={styles.merchantIconBg}>
              <Ionicons name="print" size={24} color={colors.white} />
            </View>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>Balaji Printers</Text>
              <Text style={styles.orderId}>Order #{pendingOrder.displayOrderId}</Text>
            </View>
            <Text style={styles.amountText}>₹{pendingOrder.pricing.total.toFixed(2)}</Text>
          </View>

          {/* Expandable Order Summary */}
          <TouchableOpacity
            style={styles.summaryToggle}
            onPress={() => setSummaryExpanded(!summaryExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.summaryToggleText}>
              {summaryExpanded ? 'Hide Order Summary' : 'Show Order Summary'}
            </Text>
            <Ionicons
              name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.blue}
            />
          </TouchableOpacity>

          {summaryExpanded && (
            <View style={styles.summaryDetails}>
              {pendingOrder.items.map((item, index) => (
                <View key={index} style={styles.summaryRow}>
                  <Text numberOfLines={1} style={styles.summaryItemName}>
                    {item.type === 'print' ? item.fileName : item.name}
                  </Text>
                  <Text style={styles.summaryItemQty}>
                    {item.type === 'print' ? `Qty: ${item.copies}` : `Qty: ${item.quantity}`}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    ₹{item.type === 'print' ? item.price.toFixed(2) : (item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalVal}>₹{pendingOrder.pricing.total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Section title */}
        <Text style={styles.sectionHeading}>PAYMENT METHOD OPTIONS</Text>

        {/* Render payment option cards */}
        {MOCK_PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            title={method.title}
            subtitle={method.subtitle}
            icon={method.icon}
            isSelected={selectedMethod === method.id}
            onSelect={() => setSelectedMethod(method.id as PaymentMethod)}
            apps={'apps' in method ? method.apps : undefined}
          />
        ))}

        <View style={styles.secureContainer}>
          <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
          <Text style={styles.secureText}>Secured by Razorpay · 128-bit SSL Encryption</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow} activeOpacity={0.8}>
          <Text style={styles.payNowButtonText}>
            Pay Now  •  ₹{pendingOrder.pricing.total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slate background typical for payment gateways
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    padding: spacing.xs,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.danger,
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#0B2F64', // Razorpay blue branding
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 110,
  },
  merchantCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    ...typography.bodyBold,
    color: colors.black,
  },
  orderId: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amountText: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
  summaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  summaryToggleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.blue,
  },
  summaryDetails: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryItemName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
    flex: 1.5,
  },
  summaryItemQty: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    flex: 0.8,
    textAlign: 'center',
  },
  summaryItemPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
    flex: 0.8,
    textAlign: 'right',
  },
  summaryDivider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  summaryTotalVal: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: colors.blue,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.lg,
  },
  secureText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  payNowButton: {
    height: 48,
    backgroundColor: '#0B2F64', // Razorpay theme blue
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payNowButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
});
