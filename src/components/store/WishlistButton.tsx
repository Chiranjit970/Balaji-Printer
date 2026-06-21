import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlistStore } from '../../store/wishlistStore';
import { colors, spacing } from '../../constants';

interface WishlistButtonProps {
  productId: string;
  size?: number;
  showBackground?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  size = 20,
  showBackground = false,
}) => {
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(productId));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    // Start heart pop animation
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
      friction: 3,
      tension: 150,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });

    toggleWishlist(productId);
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      style={[
        styles.touchable,
        showBackground && styles.background,
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={size}
          color={isWishlisted ? colors.danger : colors.textMuted}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  background: {
    backgroundColor: colors.white,
    borderRadius: 100,
    width: 32,
    height: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
