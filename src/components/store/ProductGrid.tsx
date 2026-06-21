import React from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View, ActivityIndicator } from 'react-native';
import { Product } from '../../types/store.types';
import { ProductCard } from './ProductCard';
import { spacing } from '../../constants';

interface ProductGridProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onAddToCart,
  isLoading = false,
}) => {
  const { width } = useWindowDimensions();
  // Adjust column count based on screen width (Responsive Layout)
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <FlatList
      key={numColumns} // Re-mount when column count changes to avoid FlatList errors
      data={products}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ProductCard
            product={item}
            onPress={() => onProductPress(item.id)}
            onAddToCart={() => onAddToCart(item)}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={false} // Since this is nested inside parent ScrollView in home screen
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 140,
    maxWidth: '50%', // Ensures clean 2-column layout even on uneven rows
  },
  loadingContainer: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
