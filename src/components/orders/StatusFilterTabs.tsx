import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { colors, spacing, typography } from '../../constants';
import { OrderStatusFilter } from '../../types/order.types';
import { STATUS_FILTER_TABS } from '../../constants/orders.constants';

interface StatusFilterTabsProps {
  selectedFilter: OrderStatusFilter;
  onFilterChange: (filter: OrderStatusFilter) => void;
  counts?: Record<OrderStatusFilter, number>;
}

export const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
  selectedFilter,
  onFilterChange,
  counts,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<Record<string, any>>({});

  const handlePress = (filterId: OrderStatusFilter) => {
    onFilterChange(filterId);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {STATUS_FILTER_TABS.map((tab) => {
        const isSelected = selectedFilter === tab.id;
        const count = counts ? counts[tab.id] : null;

        return (
          <FilterTabButton
            key={tab.id}
            label={tab.label}
            count={count}
            isSelected={isSelected}
            onPress={() => handlePress(tab.id)}
          />
        );
      })}
    </ScrollView>
  );
};

interface FilterTabButtonProps {
  label: string;
  count: number | null;
  isSelected: boolean;
  onPress: () => void;
}

const FilterTabButton: React.FC<FilterTabButtonProps> = ({
  label,
  count,
  isSelected,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.pill,
          isSelected ? styles.pillSelected : styles.pillUnselected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={[styles.pillText, isSelected ? styles.textSelected : styles.textUnselected]}>
          {label}
          {count !== null && count > 0 ? ` (${count})` : ''}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: 8,
  },
  pill: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  pillSelected: {
    backgroundColor: colors.blue,
  },
  pillUnselected: {
    backgroundColor: colors.surface,
  },
  pillText: {
    ...typography.bodyBold,
    fontSize: 13,
  },
  textSelected: {
    color: colors.white,
  },
  textUnselected: {
    color: colors.textMuted,
  },
});
