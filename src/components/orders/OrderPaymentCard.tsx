import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';
import { PAYMENT_STATUS_CONFIG } from '../../constants/orders.constants';
import { DateUtils } from '../../utils/date.utils';

interface OrderPaymentCardProps {
  order: Order;
}

export const OrderPaymentCard: React.FC<OrderPaymentCardProps> = ({ order }) => {
  const { paymentStatus, paymentMethod, razorpayPaymentId, createdAt } = order;

  const statusConfig = PAYMENT_STATUS_CONFIG[paymentStatus] || {
    label: paymentStatus,
    color: '#666666',
    bgColor: '#F5F5F5',
  };

  // Human-readable payment method
  const getReadableMethod = () => {
    if (!paymentMethod) return 'N/A';
    const dict: Record<string, string> = {
      upi: 'Razorpay (UPI)',
      card: 'Razorpay (Card)',
      netbanking: 'Razorpay (Net Banking)',
      wallet: 'Razorpay (Wallet)',
      mock: 'Razorpay (Mock Test)',
    };
    return dict[paymentMethod] || `Razorpay (${paymentMethod.toUpperCase()})`;
  };

  // Truncate payment ID
  const getFormattedPaymentId = () => {
    if (!razorpayPaymentId) return 'N/A';
    if (razorpayPaymentId.length <= 16) return razorpayPaymentId;
    return `...${razorpayPaymentId.slice(-12)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        {/* Method Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>{getReadableMethod()}</Text>
        </View>

        {/* Payment ID Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Payment ID</Text>
          <Text style={[styles.value, styles.monoValue]}>
            {getFormattedPaymentId()}
          </Text>
        </View>

        {/* Date Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Paid On</Text>
          <Text style={styles.value}>
            {DateUtils.formatPaymentDate(createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    ...typography.bodyBold,
    fontSize: 11,
    textTransform: 'capitalize',
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
  label: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
  },
  value: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 13,
  },
  monoValue: {
    fontFamily: 'Courier', // Standard monospaced font
  },
});
