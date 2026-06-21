import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants';

interface CartToastProps {
  visible: boolean;
  message?: string;
  onHide: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CartToast: React.FC<CartToastProps> = ({
  visible,
  message = 'Item added to cart!',
  onHide,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide Up
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto Hide after 2 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(100);
      opacity.setValue(0);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 80, // float above sticky bar or tabs
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={20} color={colors.white} style={styles.icon} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Dark slate premium color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    maxWidth: SCREEN_WIDTH - 64,
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
