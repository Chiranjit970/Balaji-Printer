import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { colors, spacing, typography, NOTIFICATION_FILTERS } from '../../constants';
import type { NotificationFilter } from '../../types/profile.types';

interface NotificationFilterTabsProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

const FilterPill: React.FC<{
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

export const NotificationFilterTabs: React.FC<NotificationFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NOTIFICATION_FILTERS.map((filter) => (
          <FilterPill
            key={filter.key}
            label={filter.label}
            isActive={activeFilter === filter.key}
            onPress={() => onFilterChange(filter.key)}
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
    backgroundColor: colors.blue,
    borderColor: colors.blue,
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
