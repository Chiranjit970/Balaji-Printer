import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface OrdersHeaderProps {
  cartCount: number;
  notificationCount: number;
  onCartPress: () => void;
  onNotificationPress: () => void;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  cartCount,
  notificationCount,
  onCartPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Brand & Action Row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Balaji Printers</Text>
        </View>

        <View style={styles.actionsContainer}>
          {/* Notification Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={24} color={colors.black} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCartPress}
            activeOpacity={0.7}
            accessibilityLabel="Cart"
          >
            <Ionicons name="cart-outline" size={24} color={colors.black} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Title */}
      <Text style={styles.screenTitle}>My Orders</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    height: 110,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandName: {
    ...typography.h2,
    color: colors.black,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  screenTitle: {
    ...typography.display,
    color: colors.black,
    fontSize: 26,
    lineHeight: 32,
  },
});
