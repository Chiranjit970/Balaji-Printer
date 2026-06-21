import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';
import { DateUtils } from '../../utils/date.utils';
import { OrderStatusChip } from './OrderStatusChip';

interface OrderSummaryHeaderProps {
  order: Order;
}

export const OrderSummaryHeader: React.FC<OrderSummaryHeaderProps> = ({ order }) => {
  const { displayOrderId, createdAt, items, pricing, status } = order;

  // Calculate items count
  const itemCount = items.reduce((sum, item) => {
    return sum + (item.type === 'product' ? item.quantity : 1);
  }, 0);

  return (
    <View style={styles.container}>
      {/* Top Row: Icon + ID & Status */}
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={20} color={colors.blue} />
          </View>
          <View style={styles.idGroup}>
            <Text style={styles.overline}>Order ID</Text>
            <Text style={styles.orderId}>{displayOrderId}</Text>
          </View>
        </View>
        <OrderStatusChip status={status} size="small" />
      </View>

      {/* Bottom Row: Date/Count & Price */}
      <View style={styles.bottomRow}>
        <Text style={styles.subtext}>
          {DateUtils.formatOrderDate(createdAt)} • {itemCount} Item{itemCount > 1 ? 's' : ''}
        </Text>
        <Text style={styles.totalPrice}>₹{pricing.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idGroup: {
    justifyContent: 'center',
  },
  overline: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  orderId: {
    ...typography.h2,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(37, 99, 235, 0.1)',
    paddingTop: spacing.sm,
    marginTop: 2,
  },
  subtext: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 13,
  },
  totalPrice: {
    ...typography.h2,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
  },
});
