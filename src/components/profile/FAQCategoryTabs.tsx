import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { colors, spacing, typography, FAQ_CATEGORIES } from '../../constants';

interface FAQCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryPill: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.pill, isActive && styles.pillActive]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FAQCategoryTabs: React.FC<FAQCategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FAQ_CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.key}
            label={cat.label}
            isActive={activeCategory === cat.key}
            onPress={() => onCategoryChange(cat.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  pillText: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textMuted,
  },
  pillTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
});
