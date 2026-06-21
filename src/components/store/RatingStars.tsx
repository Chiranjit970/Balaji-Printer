import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface RatingStarsProps {
  rating: number; // 0 - 5
  count?: number; // review count
  size?: 'small' | 'medium';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'small',
}) => {
  const starSize = size === 'small' ? 12 : 16;
  const stars: React.ReactNode[] = [];

  const filledCount = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  const emptyCount = 5 - filledCount - (hasHalf ? 1 : 0);

  for (let i = 0; i < filledCount; i++) {
    stars.push(
      <Ionicons key={`filled-${i}`} name="star" size={starSize} color="#F59E0B" />
    );
  }

  if (hasHalf) {
    stars.push(
      <Ionicons key="half" name="star-half" size={starSize} color="#F59E0B" />
    );
  }

  for (let i = 0; i < emptyCount; i++) {
    stars.push(
      <Ionicons key={`empty-${i}`} name="star-outline" size={starSize} color={colors.border} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {count !== undefined && (
        <Text style={[styles.countText, size === 'medium' && styles.countTextMedium]}>
          ({count})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  countText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  countTextMedium: {
    ...typography.body,
    color: colors.textMuted,
  },
});
