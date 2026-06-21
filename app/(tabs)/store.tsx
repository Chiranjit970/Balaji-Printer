import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '../../src/hooks/useCategories';
import { useFeaturedProducts, useBestSellers } from '../../src/hooks/useProducts';
import { useNotificationCount } from '../../src/hooks/useNotificationCount';
import { useCartStore } from '../../src/store/cartStore';
import { colors, spacing, typography } from '../../src/constants';

// Store Components
import { StoreHeader } from '../../src/components/store/StoreHeader';
import { StoreSearchBar } from '../../src/components/store/StoreSearchBar';
import { CategoryList } from '../../src/components/store/CategoryList';
import { FeaturedCarousel } from '../../src/components/store/FeaturedCarousel';
import { ProductGrid } from '../../src/components/store/ProductGrid';
import { PromoBanner } from '../../src/components/store/PromoBanner';
import { StoreSkeleton } from '../../src/components/store/StoreSkeleton';
import { CartToast } from '../../src/components/common/CartToast';
import { EmptyState } from '../../src/components/common/EmptyState';

export default function StoreScreen() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Zustand State
  const cartCount = useCartStore((state) => state.itemCount);
  const addProduct = useCartStore((state) => state.addProduct);

  // Queries
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
    isError: categoriesError,
  } = useCategories();

  const {
    data: featuredProducts = [],
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useFeaturedProducts();

  const {
    data: bestSellers = [],
    isLoading: bestSellersLoading,
    refetch: refetchBestSellers,
  } = useBestSellers();

  const { data: notificationData } = useNotificationCount();
  const notificationCount = notificationData?.unread || 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCategories(),
      refetchFeatured(),
      refetchBestSellers(),
    ]);
    setRefreshing(false);
  };

  const handleAddToCart = (product: any) => {
    addProduct({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    setToastMessage(`${product.name} added to cart!`);
    setToastVisible(true);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/(store)/product/${productId}`);
  };

  const handleSearchPress = () => {
    router.push('/(store)/search');
  };

  const handlePromoPress = () => {
    setToastMessage('Promo packages coming in Phase 5!');
    setToastVisible(true);
  };

  const isLoading = categoriesLoading || featuredLoading || bestSellersLoading;

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StoreHeader
          cartCount={cartCount}
          notificationCount={notificationCount}
          onCartPress={() => router.push('/(tabs)/orders')} // fallback or cart tab
          onNotificationPress={() => router.push('/(tabs)/notifications')}
        />
        <StoreSkeleton />
      </SafeAreaView>
    );
  }

  if (categoriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <StoreHeader
          cartCount={cartCount}
          notificationCount={notificationCount}
          onCartPress={() => router.push('/(tabs)/orders')}
          onNotificationPress={() => router.push('/(tabs)/notifications')}
        />
        <EmptyState
          icon="alert-circle-outline"
          title="Could Not Load Store"
          message="There was an error loading store products. Please try again."
          actionText="Retry"
          onActionPress={onRefresh}
        />
      </SafeAreaView>
    );
  }

  // Filter best sellers based on selected category bubble
  const filteredBestSellers = selectedCategoryId === 'all'
    ? bestSellers
    : bestSellers.filter(p => p.categoryId === selectedCategoryId);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StoreHeader
        cartCount={cartCount}
        notificationCount={notificationCount}
        onCartPress={() => {
          setToastMessage('Opening cart... (Checkout details in Phase 5)');
          setToastVisible(true);
        }}
        onNotificationPress={() => router.push('/(tabs)/notifications')}
      />

      {/* Interactive Search Bar (navigates to Search Screen on Press) */}
      <StoreSearchBar isInteractive={false} onPress={handleSearchPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue]} />
        }
      >
        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => setSelectedCategoryId('all')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </View>

        {/* Featured Products (Carousel) */}
        {featuredProducts.length > 0 && selectedCategoryId === 'all' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
            </View>
            <FeaturedCarousel
              products={featuredProducts}
              onProductPress={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>
        )}

        {/* Best Sellers Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategoryId === 'all' ? 'Best Sellers' : categories.find(c => c.id === selectedCategoryId)?.name}
            </Text>
            {selectedCategoryId === 'all' && (
              <TouchableOpacity onPress={() => setSelectedCategoryId('visiting-cards')}>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {filteredBestSellers.length > 0 ? (
            <ProductGrid
              products={filteredBestSellers}
              onProductPress={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <View style={styles.emptyGrid}>
              <Text style={styles.emptyGridText}>No products found in this category.</Text>
            </View>
          )}
        </View>

        {/* Banners */}
        <PromoBanner
          title="Bulk Printing Offers"
          subtitle="Order 500+ cards and save 30%"
          ctaText="View Offers"
          backgroundColor={colors.blueLight}
          onCTAPress={handlePromoPress}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Cart Addition Popup Toast */}
      <CartToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionContainer: {
    marginVertical: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  sectionTitle: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  sectionAction: {
    ...typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  emptyGrid: {
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGridText: {
    ...typography.body,
    color: colors.textMuted,
  },
  bottomSpacer: {
    height: 48,
  },
});
