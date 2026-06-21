import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileHeader } from '../../src/components/profile/ProfileHeader';
import { ProfileMenuSection } from '../../src/components/profile/ProfileMenuSection';
import { LogoutSheet } from '../../src/components/profile/LogoutSheet';
import { useAuthStore } from '../../src/store/authStore';
import { useCartStore } from '../../src/store/cartStore';
import { useNotificationStore } from '../../src/store/notificationStore';
import { useNotifications } from '../../src/hooks/useProfile';
import { PROFILE_MENU_SECTIONS } from '../../src/constants/profile.constants';
import { colors, spacing } from '../../src/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clearCart);
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications for badge count
  useNotifications();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    setRefreshing(false);
  }, [queryClient]);

  const handleMenuItemPress = (item: any) => {
    if (item.route === 'logout') {
      setShowLogout(true);
      return;
    }
    router.push(item.route as any);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      clearCart();
      queryClient.clear();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('[Logout] Error:', err);
    } finally {
      setIsLoggingOut(false);
      setShowLogout(false);
    }
  };

  // Inject notification badge count into menu items
  const menuSections = PROFILE_MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      badge: item.id === 'notifications' ? unreadCount : undefined,
    })),
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.blue}
            colors={[colors.blue]}
          />
        }
      >
        {/* Profile Header */}
        <ProfileHeader
          name={user?.name || null}
          phone={user?.phone || '+91 XXXXX XXXXX'}
          createdAt={user?.createdAt}
          onEditPress={() => router.push('/(profile)/edit-profile' as any)}
        />

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuSections.map((section, index) => (
            <ProfileMenuSection
              key={index}
              title={section.title}
              items={section.items}
              onItemPress={handleMenuItemPress}
            />
          ))}
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Balaji Printers v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation */}
      <LogoutSheet
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  menuContainer: {
    marginTop: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
  },
});
