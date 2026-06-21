import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../../types/order.types';
import { getOrderIcon, ORDER_ICON_CONFIG } from '../../constants/orders.constants';
import { colors, spacing, typography } from '../../constants';
import { DateUtils } from '../../utils/date.utils';
import { OrderStatusChip } from './OrderStatusChip';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 100,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 100,
      bounciness: 6,
    }).start();
  };

  // Determine Icon Colors
  const hash = order.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const iconIndex = hash % 5;
  const iconConfig = getOrderIcon(order.id);

  const iconColors: Record<number, string> = {
    0: '#2563EB',
    1: '#D97706',
    2: '#16A34A',
    3: '#2563EB',
    4: '#A21CAF',
  };
  const iconColor = iconColors[iconIndex] || colors.black;

  // Calculate items count
  const itemCount = order.items.reduce((sum, item) => {
    return sum + (item.type === 'product' ? item.quantity : 1);
  }, 0);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        {/* Left: Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}>
          <Ionicons name={iconConfig.icon as any} size={24} color={iconColor} />
        </View>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.overline}>Order ID</Text>
          <Text numberOfLines={1} style={styles.orderId}>
            {order.displayOrderId}
          </Text>
          <Text style={styles.subtext}>
            {DateUtils.formatOrderDate(order.createdAt)} • {itemCount} Item{itemCount > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Right content */}
        <View style={styles.rightContent}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{order.pricing.total.toFixed(2)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
          <OrderStatusChip status={order.status} size="small" />
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: spacing.lg,
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  centerContent: {
    flex: 1,
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
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 15,
    marginBottom: 2,
  },
  subtext: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 56,
    paddingVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  price: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.black,
  },
});
