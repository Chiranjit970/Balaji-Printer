import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Product } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';

interface RelatedProductsProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  onProductPress,
  onAddToCart,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You May Also Like</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onProductPress(item.id)}
            activeOpacity={0.9}
          >
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

            <View style={styles.infoContainer}>
              <Text numberOfLines={1} style={styles.name}>
                {item.name}
              </Text>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  card: {
    width: 140,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: '100%',
    height: 100,
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
    padding: spacing.xs,
  },
  name: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
  addButton: {
    backgroundColor: colors.blueLight,
    borderWidth: 0.5,
    borderColor: colors.blue,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
  },
});
