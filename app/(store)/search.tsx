import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchProducts } from '../../src/hooks/useSearchProducts';
import { useCartStore } from '../../src/store/cartStore';
import { useNotificationCount } from '../../src/hooks/useNotificationCount';
import { colors, spacing } from '../../src/constants';

// Store Components
import { StoreHeader } from '../../src/components/store/StoreHeader';
import { StoreSearchBar } from '../../src/components/store/StoreSearchBar';
import { SortFilterBar } from '../../src/components/store/SortFilterBar';
import { ProductListCard } from '../../src/components/store/ProductListCard';
import { CartToast } from '../../src/components/common/CartToast';
import { EmptyState } from '../../src/components/common/EmptyState';

export default function SearchScreen() {
  const router = useRouter();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Zustand State
  const cartCount = useCartStore((state) => state.itemCount);
  const addProduct = useCartStore((state) => state.addProduct);

  // Notifications
  const { data: notificationData } = useNotificationCount();
  const notificationCount = notificationData?.unread || 0;

  // Search Hook
  const {
    query,
    setQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    results,
    totalCount,
    isLoading,
  } = useSearchProducts();

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

  const handleFilterPress = () => {
    setToastMessage('Filters coming in Phase 5!');
    setToastVisible(true);
  };

  // Render empty state or initial state depending on query length
  const renderEmptyState = () => {
    if (query.trim().length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Search for products"
          message="Browse visiting cards, banners, flyers, stationery, and more."
        />
      );
    }

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }

    return (
      <EmptyState
        icon="search-outline"
        title={`No results for "${query}"`}
        message="Try checking for spelling errors, using different keywords, or browse categories."
        actionText="Browse Categories"
        onActionPress={() => router.back()}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <StoreHeader
        showBack={true}
        title="Search"
        cartCount={cartCount}
        notificationCount={notificationCount}
        onCartPress={() => {
          setToastMessage('Opening cart... (Checkout details in Phase 5)');
          setToastVisible(true);
        }}
      />

      {/* Interactive Search Field */}
      <StoreSearchBar
        isInteractive={true}
        autoFocus={true}
        value={query}
        onChangeText={setQuery}
        onFilterPress={handleFilterPress}
      />

      {/* Result list or empty states */}
      {query.trim().length > 0 && !isLoading && results.length > 0 ? (
        <View style={styles.listContainer}>
          {/* Sorting / Filter Summary Header */}
          <SortFilterBar
            totalCount={totalCount}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filters={filters}
            onFilterChange={setFilters}
          />

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductListCard
                product={item}
                onPress={() => handleProductPress(item.id)}
                onAddToCart={() => handleAddToCart(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        renderEmptyState()
      )}

      {/* Toast Feedback */}
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
