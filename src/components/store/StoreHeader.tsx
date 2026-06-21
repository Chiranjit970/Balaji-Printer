import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../../constants';
import { NotificationBadge } from '../navigation/NotificationBadge';

interface StoreHeaderProps {
  cartCount: number;
  notificationCount: number;
  onCartPress?: () => void;
  onNotificationPress?: () => void;
  showBack?: boolean;
  title?: string;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  cartCount,
  notificationCount,
  onCartPress,
  onNotificationPress,
  showBack = false,
  title = 'Balaji Printers',
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push('/(tabs)/store'); // fallback or route
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Ionicons name="print-outline" size={24} color={colors.blue} />
          </View>
        )}
        <Text style={[styles.title, showBack && styles.titleWithBack]}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {onNotificationPress && (
          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.black} />
            {notificationCount > 0 && (
              <NotificationBadge count={notificationCount} position="top-right" size="small" />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleCartPress} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="cart-outline" size={24} color={colors.black} />
          {cartCount > 0 && (
            <NotificationBadge count={cartCount} position="top-right" size="small" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  logoContainer: {
    marginRight: spacing.xs,
  },
  title: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  titleWithBack: {
    marginLeft: spacing.xs,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
