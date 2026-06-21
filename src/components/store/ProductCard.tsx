import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Product } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';
import { RatingStars } from './RatingStars';
import { WishlistButton } from './WishlistButton';
import { QuickAddButton } from './QuickAddButton';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        {/* Wishlist Button over Image */}
        <View style={styles.wishlistContainer}>
          <WishlistButton productId={product.id} showBackground />
        </View>

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
          <Text numberOfLines={1} style={styles.name}>
            {product.name}
          </Text>
          <Text numberOfLines={1} style={styles.description}>
            {product.shortDescription}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} count={product.reviewCount} size="small" />
          </View>

          {/* Price & Quick Add */}
          <View style={styles.bottomRow}>
            <Text style={styles.price}>
              ₹{product.price.toFixed(2)}
            </Text>
            <QuickAddButton onPress={onAddToCart} />
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wishlistContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  imageContainer: {
    width: '100%',
    height: 140,
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
    padding: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: 2,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    marginBottom: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
});
