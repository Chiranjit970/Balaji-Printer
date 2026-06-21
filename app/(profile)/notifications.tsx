import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCard } from '../../src/components/profile/NotificationCard';
import { NotificationFilterTabs } from '../../src/components/profile/NotificationFilterTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useNotificationStore } from '../../src/store/notificationStore';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllRead,
} from '../../src/hooks/useProfile';
import { colors, spacing, typography } from '../../src/constants';
import type { Notification, NotificationFilter } from '../../src/types/profile.types';

export default function NotificationCenterScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Fetch notifications
  const { isLoading, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllRead();

  // Store state
  const filter = useNotificationStore((s) => s.filter);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const filteredNotifications = useNotificationStore((s) => s.getFilteredNotifications());
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  const [refreshing, setRefreshing] = useState(false);

  // Set header right button for "Mark All Read"
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        unreadCount > 0 ? (
          <TouchableOpacity
            onPress={() => markAllMutation.mutate()}
            style={styles.markAllButton}
            activeOpacity={0.7}
          >
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, unreadCount, markAllMutation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }

    // Navigate to order details if order_update type
    if (notification.type === 'order_update' && notification.orderId) {
      router.push(`/(orders)/${notification.orderId}` as any);
    }
  };

  const handleFilterChange = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationCard notification={item} onPress={handleNotificationPress} />
  );

  const getEmptyMessage = () => {
    if (filter === 'all') return 'No notifications yet. We\'ll keep you updated on orders and offers.';
    if (filter === 'order_update') return 'No order updates yet.';
    if (filter === 'promo') return 'No offers available right now.';
    return 'No system notifications.';
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Filter Tabs */}
      <NotificationFilterTabs
        activeFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          filteredNotifications.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.blue}
            colors={[colors.blue]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="notifications-off-outline"
              title="No Notifications"
              message={getEmptyMessage()}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
  },
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  markAllText: {
    ...typography.caption,
    color: colors.blue,
    fontWeight: '600',
  },
});
