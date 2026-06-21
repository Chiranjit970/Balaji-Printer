import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderPricing } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';

interface OrderPriceBreakdownProps {
  pricing: OrderPricing;
}

export const OrderPriceBreakdown: React.FC<OrderPriceBreakdownProps> = ({ pricing }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Price Breakdown</Text>
      
      <View style={styles.card}>
        {/* Subtotal */}
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{pricing.subtotal.toFixed(2)}</Text>
        </View>

        {/* Delivery Fee */}
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>
            {pricing.deliveryFee > 0 ? `₹${pricing.deliveryFee.toFixed(2)}` : 'Free'}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Total Paid */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>₹{pricing.total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    marginTop: spacing.xs,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  value: {
    ...typography.body,
    color: colors.black,
    fontSize: 13,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.blue,
    fontSize: 15,
  },
  totalValue: {
    ...typography.bodyBold,
    color: colors.blue,
    fontSize: 16,
  },
});
