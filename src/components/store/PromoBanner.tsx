import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundColor: string;
  image?: any;
  onCTAPress: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  ctaText,
  backgroundColor,
  onCTAPress,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftContent}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <TouchableOpacity
          onPress={onCTAPress}
          style={styles.ctaButton}
          activeOpacity={0.7}
        >
          <Text style={styles.ctaText}>{ctaText}</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.blue} style={styles.ctaIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightContent}>
        <Ionicons name="pricetag-outline" size={48} color={colors.blue} style={styles.illustration} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 104,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.black,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  illustration: {
    opacity: 0.25,
  },
});
