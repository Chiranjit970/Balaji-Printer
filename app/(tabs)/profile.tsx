import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SafeContainer from '../../src/components/layouts/SafeContainer';
import Button from '../../src/components/common/Button';
import { typography, colors, spacing } from '../../src/constants';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'expo-router';

/**
 * Profile screen placeholder.
 * Includes a working logout button for testing session clearing.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Profile Screen</Text>
        <Text style={styles.subtitle}>Phase 2 – Coming Soon</Text>
        {user ? (
          <Text style={styles.userInfo}>
            Logged in as: {user.name ?? user.phone}
          </Text>
        ) : null}
        <View style={styles.actions}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            loading={isLoading}
            accessibilityLabel="Log out of your account"
          />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.black,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  userInfo: {
    ...typography.bodyBold,
    color: colors.blue,
    marginTop: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 280,
  },
});
