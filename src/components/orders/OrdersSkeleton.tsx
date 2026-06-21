import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { colors, spacing } from '../../constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const OrdersSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Search Bar Shimmer */}
      <View style={styles.searchRow}>
        <ShimmerPlaceholder style={styles.searchBar} />
        <ShimmerPlaceholder style={styles.filterButton} />
      </View>

      {/* Filter Tabs Shimmer */}
      <View style={styles.filterTabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ShimmerPlaceholder key={i} style={styles.filterPill} />
          ))}
        </ScrollView>
      </View>

      {/* Order Cards Shimmer */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.card}>
            <ShimmerPlaceholder style={styles.iconCircle} />
            <View style={styles.middleColumn}>
              <ShimmerPlaceholder style={styles.labelLine} />
              <ShimmerPlaceholder style={styles.idLine} />
              <ShimmerPlaceholder style={styles.subLine} />
            </View>
            <View style={styles.rightColumn}>
              <ShimmerPlaceholder style={styles.priceLine} />
              <ShimmerPlaceholder style={styles.statusChip} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 8,
  },
  filterButton: {
    width: 80,
    height: 48,
    borderRadius: 8,
  },
  filterTabsWrapper: {
    marginBottom: spacing.md,
  },
  filterTabs: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterPill: {
    width: 90,
    height: 36,
    borderRadius: 18,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  middleColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  labelLine: {
    width: 60,
    height: 10,
    borderRadius: 4,
  },
  idLine: {
    width: 100,
    height: 16,
    borderRadius: 4,
  },
  subLine: {
    width: 120,
    height: 12,
    borderRadius: 4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  priceLine: {
    width: 70,
    height: 18,
    borderRadius: 4,
  },
  statusChip: {
    width: 80,
    height: 22,
    borderRadius: 11,
  },
});
