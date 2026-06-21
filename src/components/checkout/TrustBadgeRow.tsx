import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants';

interface TrustBadgeRowProps {
  badges: readonly { icon: string; label: string }[];
}

export const TrustBadgeRow: React.FC<TrustBadgeRowProps> = ({
  badges,
}) => {
  return (
    <View style={styles.container}>
      {badges.map((badge, index) => (
        <View key={index} style={styles.badgeItem}>
          <View style={styles.iconWrapper}>
            <Ionicons name={badge.icon as any} size={24} color={colors.blue} />
          </View>
          <Text numberOfLines={2} style={styles.label}>
            {badge.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB', // very light grey bg
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 12,
  },
});
