import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../constants';
import { NotificationBadge } from '../navigation/NotificationBadge';

interface CheckoutHeaderProps {
  title: string;
  onBack?: () => void;
  showCart?: boolean;
  cartCount?: number;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  title,
  onBack,
  showCart = false,
  cartCount = 0,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color={colors.black} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {showCart ? (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/(checkout)/cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.black} />
            {cartCount > 0 && (
              <NotificationBadge count={cartCount} position="top-right" size="small" />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
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
  backButton: {
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  title: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 32, // keeps title perfectly centered when matching back button size
  },
  cartButton: {
    position: 'relative',
    padding: spacing.xs,
  },
  placeholder: {
    width: 24,
  },
});
