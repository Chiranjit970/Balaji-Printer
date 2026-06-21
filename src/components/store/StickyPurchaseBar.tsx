import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants';

interface StickyPurchaseBarProps {
  price: number;
  quantity: number;
  currency: string;
  inStock: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isLoading?: boolean;
}

export const StickyPurchaseBar: React.FC<StickyPurchaseBarProps> = ({
  price,
  quantity,
  inStock,
  onAddToCart,
  onBuyNow,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const totalPrice = price * quantity;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      {/* Primary: Add To Cart */}
      <TouchableOpacity
        style={[
          styles.addToCartButton,
          (!inStock || isLoading) && styles.disabledButton,
        ]}
        onPress={onAddToCart}
        disabled={!inStock || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="cart" size={20} color={colors.white} style={styles.cartIcon} />
            <Text style={styles.addToCartText}>
              {!inStock ? 'Out of Stock' : `Add to Cart  •  ₹${totalPrice.toFixed(2)}`}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Secondary: Buy Now */}
      <TouchableOpacity
        style={[
          styles.buyNowButton,
          !inStock && styles.disabledBuyNowButton,
        ]}
        onPress={onBuyNow}
        disabled={!inStock || isLoading}
        activeOpacity={0.8}
      >
        <Text style={[styles.buyNowText, !inStock && styles.disabledBuyNowText]}>
          Buy Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    // Shadow above the bar
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  addToCartButton: {
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  disabledButton: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: spacing.xs,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.white,
  },
  buyNowButton: {
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBuyNowButton: {
    borderColor: colors.border,
  },
  buyNowText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  disabledBuyNowText: {
    color: colors.textMuted,
  },
});
