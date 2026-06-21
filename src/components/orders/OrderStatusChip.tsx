import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../../types/order.types';
import { ORDER_STATUS_CONFIG } from '../../constants/orders.constants';
import { typography } from '../../constants';

interface OrderStatusChipProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
}

export const OrderStatusChip: React.FC<OrderStatusChipProps> = ({
  status,
  size = 'small',
}) => {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status,
    color: '#666666',
    bgColor: '#F5F5F5',
  };

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: config.bgColor },
        isSmall ? styles.chipSmall : styles.chipMedium,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.color },
          isSmall ? styles.textSmall : styles.textMedium,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    ...typography.bodyBold,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
});
