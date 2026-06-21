import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderPricing } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';

interface CheckoutPricingCardProps {
  pricing: OrderPricing;
}

export const CheckoutPricingCard: React.FC<CheckoutPricingCardProps> = ({
  pricing,
}) => {
  const isFreeDelivery = pricing.deliveryFee === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.divider} />

      {pricing.printJobsTotal > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Print Jobs</Text>
          <Text style={styles.value}>₹{pricing.printJobsTotal.toFixed(2)}</Text>
        </View>
      )}

      {pricing.productsTotal > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Store Products</Text>
          <Text style={styles.value}>₹{pricing.productsTotal.toFixed(2)}</Text>
        </View>
      )}

      {(pricing.printJobsTotal > 0 || pricing.productsTotal > 0) && (
        <View style={styles.divider} />
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{pricing.subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={[styles.value, isFreeDelivery && styles.freeText]}>
          {isFreeDelivery ? 'FREE' : `₹${pricing.deliveryFee.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount Paid</Text>
        <Text style={styles.totalValue}>₹{pricing.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
  },
  freeText: {
    color: colors.success,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    paddingVertical: 4,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 15,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.blue,
  },
});
