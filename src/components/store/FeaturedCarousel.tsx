import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Product } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';

interface FeaturedCarouselProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = 220;

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products,
  onProductPress,
  onAddToCart,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={CAROUSEL_WIDTH}
        height={CARD_HEIGHT + 16}
        autoPlay={true}
        autoPlayInterval={4000}
        data={products}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActiveIndex(index)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 45,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onProductPress(item.id)}
            activeOpacity={0.9}
          >
            {/* Left side info */}
            <View style={styles.leftInfo}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Featured</Text>
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddToCart(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>

            {/* Right side image */}
            <View style={styles.imageContainer}>
              {item.images && item.images[0] ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination Indicator */}
      <View style={styles.pagination}>
        {products.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftInfo: {
    flex: 1.1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
    textTransform: 'uppercase',
  },
  name: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    marginTop: spacing.xs,
  },
  description: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    lineHeight: 14,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  addButton: {
    backgroundColor: colors.blue,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
  imageContainer: {
    flex: 0.9,
    height: '100%',
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 14,
    backgroundColor: colors.blue,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.border,
  },
});
