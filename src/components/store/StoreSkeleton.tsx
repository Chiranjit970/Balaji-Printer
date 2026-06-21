import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { colors, spacing } from '../../constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StoreSkeleton: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar Skeleton */}
      <View style={styles.searchContainer}>
        <ShimmerPlaceholder style={styles.searchBar} />
        <ShimmerPlaceholder style={styles.filterButton} />
      </View>

      {/* Shop By Category Skeleton */}
      <View style={styles.sectionHeader}>
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <ShimmerPlaceholder style={styles.viewAllText} />
      </View>
      <View style={styles.categoriesRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.categoryItem}>
            <ShimmerPlaceholder style={styles.categoryBubble} />
            <ShimmerPlaceholder style={styles.categoryLabel} />
          </View>
        ))}
      </View>

      {/* Featured Carousel Skeleton */}
      <View style={styles.sectionHeader}>
        <ShimmerPlaceholder style={styles.sectionTitle} />
      </View>
      <View style={styles.carouselContainer}>
        <ShimmerPlaceholder style={styles.carouselCard} />
      </View>

      {/* Best Sellers Skeleton */}
      <View style={styles.sectionHeader}>
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <ShimmerPlaceholder style={styles.viewAllText} />
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <ShimmerPlaceholder style={styles.gridCard} />
          <ShimmerPlaceholder style={styles.gridCard} />
        </View>
        <View style={styles.gridRow}>
          <ShimmerPlaceholder style={styles.gridCard} />
          <ShimmerPlaceholder style={styles.gridCard} />
        </View>
      </View>

      {/* Promo Banner Skeleton */}
      <ShimmerPlaceholder style={styles.promoBanner} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    width: 140,
    height: 20,
    borderRadius: 4,
  },
  viewAllText: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryItem: {
    alignItems: 'center',
    width: 60,
  },
  categoryBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    width: '100%',
    height: 10,
    borderRadius: 2,
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  carouselCard: {
    width: SCREEN_WIDTH * 0.85,
    height: 220,
    borderRadius: 12,
  },
  gridContainer: {
    paddingHorizontal: spacing.md,
    gap: 12,
    marginBottom: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    height: 220,
    borderRadius: 12,
  },
  promoBanner: {
    height: 100,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: 32,
  },
});
