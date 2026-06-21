import React, { useRef } from 'react';
import { Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View
          style={[
            styles.bubble,
            { backgroundColor: isSelected ? colors.blue : category.color },
          ]}
        >
          <Ionicons
            name={category.icon as any}
            size={24}
            color={isSelected ? colors.white : colors.blue}
          />
        </Animated.View>
        <Text
          numberOfLines={2}
          style={[
            styles.label,
            isSelected ? styles.labelSelected : styles.labelUnselected,
          ]}
        >
          {category.name}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 72,
    marginRight: spacing.xs,
  },
  bubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    // Soft shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  labelSelected: {
    color: colors.blue,
  },
  labelUnselected: {
    color: colors.textMuted,
  },
});
