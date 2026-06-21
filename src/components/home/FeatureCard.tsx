import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import { homeColors } from '../../constants/home.constants';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(300).delay(delay)}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color={colors.blue} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%', // 2 cards per row
    backgroundColor: homeColors.featureCardBg,
    borderWidth: 1,
    borderColor: homeColors.featureCardBorder,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: homeColors.featureIconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodyBold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
