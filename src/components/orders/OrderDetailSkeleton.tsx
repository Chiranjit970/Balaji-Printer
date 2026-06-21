import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { colors, spacing } from '../../constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const OrderDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card Shimmer */}
        <ShimmerPlaceholder style={styles.summaryCard} />

        {/* Section: Status */}
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <View style={styles.timelineCard}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <ShimmerPlaceholder style={styles.timelineCircle} />
                {i < 4 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineRight}>
                <ShimmerPlaceholder style={styles.textLineLarge} />
                <ShimmerPlaceholder style={styles.textLineSmall} />
              </View>
            </View>
          ))}
        </View>

        {/* Section: Items */}
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <View style={styles.itemsCard}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.itemRow}>
              <ShimmerPlaceholder style={styles.itemThumbnail} />
              <View style={styles.itemMiddle}>
                <ShimmerPlaceholder style={styles.textLineLarge} />
                <ShimmerPlaceholder style={styles.textLineSmall} />
              </View>
              <ShimmerPlaceholder style={styles.priceLine} />
            </View>
          ))}
        </View>

        {/* Section: Delivery Address */}
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <ShimmerPlaceholder style={styles.infoCard} />

        {/* Section: Payment Details */}
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <ShimmerPlaceholder style={styles.infoCard} />

        {/* Section: Price Breakdown */}
        <ShimmerPlaceholder style={styles.sectionTitle} />
        <ShimmerPlaceholder style={styles.breakdownCard} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryCard: {
    width: '100%',
    height: 104,
    borderRadius: 12,
  },
  sectionTitle: {
    width: 140,
    height: 18,
    borderRadius: 4,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 22,
  },
  timelineCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  itemsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  itemMiddle: {
    flex: 1,
    gap: spacing.xs,
  },
  infoCard: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  breakdownCard: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  textLineLarge: {
    width: 150,
    height: 14,
    borderRadius: 4,
  },
  textLineSmall: {
    width: 100,
    height: 11,
    borderRadius: 4,
  },
  priceLine: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
});
