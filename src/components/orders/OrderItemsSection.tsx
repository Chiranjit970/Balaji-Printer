import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartItem, CartPrintItem, CartProductItem } from '../../types/cart.types';
import { OrderPrintJobRow } from './OrderPrintJobRow';
import { OrderProductRow } from './OrderProductRow';
import { spacing, typography, colors } from '../../constants';

interface OrderItemsSectionProps {
  items: CartItem[];
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({ items }) => {
  // Filter items
  const printItems = items.filter((item) => item.type === 'print') as CartPrintItem[];
  const productItems = items.filter((item) => item.type === 'product') as CartProductItem[];

  return (
    <View style={styles.container}>
      {/* Print Jobs Section */}
      {printItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Print Jobs ({printItems.length})</Text>
          <View style={styles.itemsWrapper}>
            {printItems.map((item, idx) => (
              <OrderPrintJobRow
                key={item.cartItemId}
                item={item}
                showDivider={idx < printItems.length - 1}
              />
            ))}
          </View>
        </View>
      )}

      {/* Products Section */}
      {productItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Products ({productItems.length})</Text>
          <View style={styles.itemsWrapper}>
            {productItems.map((item, idx) => (
              <OrderProductRow
                key={item.cartItemId}
                item={item}
                showDivider={idx < productItems.length - 1}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  itemsWrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
});
