import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOrders } from '../../src/hooks/useOrders';
import { useCartStore } from '../../src/store/cartStore';
import { useOrderStore } from '../../src/store/orderStore';
import { useNotificationCount } from '../../src/hooks/useNotificationCount';
import { OrdersService } from '../../src/services/orders.service';
import { OrderStatusFilter } from '../../src/types/order.types';
import { colors, spacing, typography } from '../../src/constants';

// UI Components
import { OrdersHeader } from '../../src/components/orders/OrdersHeader';
import { OrderSearchBar } from '../../src/components/orders/OrderSearchBar';
import { StatusFilterTabs } from '../../src/components/orders/StatusFilterTabs';
import { OrderCard } from '../../src/components/orders/OrderCard';
import { OrdersSkeleton } from '../../src/components/orders/OrdersSkeleton';

// Common Components
import { EmptyState } from '../../src/components/common/EmptyState';
import ErrorView from '../../src/components/common/ErrorView';
import Button from '../../src/components/common/Button';

export default function OrdersScreen() {
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderStatusFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Badge States
  const cartCount = useCartStore((s) => s.itemCount);
  const { data: notificationData } = useNotificationCount();
  const notificationCount = notificationData?.unread || 0;

  // Sync newly confirmed order from Phase 5 checkout
  const confirmedOrder = useOrderStore((s) => s.confirmedOrder);
  useEffect(() => {
    if (confirmedOrder) {
      OrdersService.appendOrder(confirmedOrder);
    }
  }, [confirmedOrder]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch orders
  const { data, isLoading, isError, refetch } = useOrders({
    statusFilter: activeFilter,
    query: debouncedQuery,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/(orders)/${orderId}`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setActiveFilter('all');
  };

  const renderContent = () => {
    if (isLoading && !refreshing) {
      return <OrdersSkeleton />;
    }

    if (isError) {
      return (
        <ErrorView
          title="Unable to load orders"
          message="Please check your internet connection and try again."
          onRetry={refetch}
        />
      );
    }

    const orders = data?.orders || [];

    // Check if the user has NEVER placed any orders at all
    // We determine this by checking if the 'all' filter and empty search yields zero results
    const isNeverOrdered =
      activeFilter === 'all' &&
      !debouncedQuery.trim() &&
      orders.length === 0;

    if (isNeverOrdered) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/illustrations/phone-auth.png')} // fallback to a cute phone auth illustration
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyMessage}>
            Looks like you haven't placed any orders.
          </Text>

          <View style={styles.ctaWrapper}>
            <Button
              title="Upload & Print"
              onPress={() => router.push('/(printing)/upload')}
              variant="primary"
            />
            <Button
              title="Browse Store"
              onPress={() => router.push('/(tabs)/store')}
              variant="secondary"
            />
          </View>
        </View>
      );
    }

    // Check if the current filter / search yields zero results
    if (orders.length === 0) {
      const filterLabel =
        activeFilter === 'all' ? '' : ` ${activeFilter}`;
      return (
        <View style={styles.filteredEmptyWrapper}>
          <EmptyState
            icon="receipt-outline"
            title={`No${filterLabel} Orders`}
            message={
              debouncedQuery.trim()
                ? `No orders matching "${debouncedQuery}" were found.`
                : `You don't have any${filterLabel} orders.`
            }
            actionText="View All Orders"
            onActionPress={handleResetFilters}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => handleOrderPress(item.id)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.blue]}
            tintColor={colors.blue}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <OrdersHeader
        cartCount={cartCount}
        notificationCount={notificationCount}
        onCartPress={() => router.push('/(checkout)/cart')}
        onNotificationPress={() => router.push('/(tabs)/notifications')}
      />

      {/* Search Input */}
      <OrderSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {
          // Toggle or reset filters
          handleResetFilters();
        }}
      />

      {/* Pill Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        <StatusFilterTabs
          selectedFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </View>

      {/* Dynamic Screen Content */}
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterTabsContainer: {
    backgroundColor: colors.white,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  illustration: {
    width: 180,
    height: 180,
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  emptyTitle: {
    ...typography.display,
    fontSize: 22,
    color: colors.black,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaWrapper: {
    width: '100%',
    gap: spacing.sm,
  },
  filteredEmptyWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
