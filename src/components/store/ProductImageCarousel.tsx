import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors, spacing } from '../../constants';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (!images || images.length === 0) return null;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Page Fraction Indicator (e.g. 1/4) */}
      <View style={styles.fractionIndicator}>
        <Text style={styles.fractionText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: colors.white,
    position: 'relative',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  image: {
    width: SCREEN_WIDTH - 32,
    height: 240,
  },
  fractionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fractionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.white,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 12,
    backgroundColor: colors.blue,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.border,
  },
});
