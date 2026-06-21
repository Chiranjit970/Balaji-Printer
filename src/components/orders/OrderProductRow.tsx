import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CartProductItem } from '../../types/cart.types';
import { colors, spacing, typography } from '../../constants';

interface OrderProductRowProps {
  item: CartProductItem;
  showDivider?: boolean;
}

export const OrderProductRow: React.FC<OrderProductRowProps> = ({
  item,
  showDivider = true,
}) => {
  const { name, price, quantity, image } = item;

  // Render product thumbnail with fallback
  const renderThumbnail = () => {
    if (image) {
      return (
        <Image
          source={{ uri: image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      );
    }
    // Fallback if no image URI is provided
    return (
      <View style={[styles.thumbnail, styles.fallbackContainer]}>
        <Image
          source={require('../../../assets/images/logo.png')} // fallback to logo
          style={styles.fallbackImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderThumbnail()}

        <View style={styles.centerDetails}>
          <Text numberOfLines={1} style={styles.productName}>
            {name}
          </Text>
          <Text style={styles.qtyText}>Qty: {quantity}</Text>
        </View>

        <Text style={styles.price}>₹{(price * quantity).toFixed(2)}</Text>
      </View>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  fallbackContainer: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fallbackImage: {
    width: 28,
    height: 28,
    opacity: 0.5,
  },
  centerDetails: {
    flex: 1,
  },
  productName: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
    marginBottom: 4,
  },
  qtyText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  price: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.black,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
