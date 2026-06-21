import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';
import { RatingStars } from './RatingStars';
import { WishlistButton } from './WishlistButton';

interface ProductListCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.images && product.images[0] ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.name}>
            {product.name}
          </Text>
          <WishlistButton productId={product.id} size={20} />
        </View>

        <Text numberOfLines={1} style={styles.description}>
          {product.shortDescription}
        </Text>

        <View style={styles.ratingRow}>
          <RatingStars rating={product.rating} count={product.reviewCount} size="small" />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ₹{product.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={(e) => {
              e.stopPropagation(); // prevent card press navigation
              onAddToCart();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAEAEA',
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'space-between',
    height: 80,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.bodyBold,
    color: colors.black,
    flex: 1,
    marginRight: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
