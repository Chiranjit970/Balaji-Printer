import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderPricing } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';

interface OrderSummaryCardProps {
  pricing: OrderPricing;
  showDeliveryNote?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  pricing,
  showDeliveryNote = true,
}) => {
  const isFreeDelivery = pricing.deliveryFee === 0;

  return (
    <View style={styles.container}>
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

      {showDeliveryNote && isFreeDelivery && (
        <View style={styles.deliveryNoteContainer}>
          <Text style={styles.deliveryNoteText}>
            🎉 You qualify for free delivery!
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
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
  deliveryNoteContainer: {
    backgroundColor: colors.blueLight,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  deliveryNoteText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: colors.blue,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    paddingVertical: spacing.xs,
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
