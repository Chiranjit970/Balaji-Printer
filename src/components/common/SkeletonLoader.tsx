import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { colors, spacing } from '../../constants';
import { homeColors } from '../../constants/home.constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View>
          <ShimmerPlaceholder style={styles.greetingLine} />
          <ShimmerPlaceholder style={styles.nameLine} />
        </View>
        <ShimmerPlaceholder style={styles.iconCircle} />
      </View>
      
      {/* Promotional Card Skeleton */}
      <ShimmerPlaceholder style={styles.promoCard} />
      
      {/* Quick Actions Skeleton */}
      <View style={styles.quickActions}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.actionItem}>
            <ShimmerPlaceholder style={styles.actionIcon} />
            <ShimmerPlaceholder style={styles.actionLabel} />
          </View>
        ))}
      </View>
      
      {/* Section Header Skeleton */}
      <ShimmerPlaceholder style={styles.sectionTitle} />
      
      {/* Feature Cards Skeleton */}
      <View style={styles.features}>
        {[1, 2, 3, 4].map((i) => (
          <ShimmerPlaceholder key={i} style={styles.featureCard} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greetingLine: {
    width: 80,
    height: 12,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  nameLine: {
    width: 120,
    height: 20,
    borderRadius: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  promoCard: {
    height: 140,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '22%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  actionLabel: {
    width: '100%',
    height: 12,
    borderRadius: 4,
  },
  sectionTitle: {
    width: 150,
    height: 20,
    borderRadius: 4,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '47%',
    height: 120,
    borderRadius: 12,
  },
});
