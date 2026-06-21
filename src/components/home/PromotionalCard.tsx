import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import { homeColors } from '../../constants/home.constants';

interface PromotionalCardProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCTAPress: () => void;
  image?: any;
}

export const PromotionalCard: React.FC<PromotionalCardProps> = ({
  title,
  subtitle,
  ctaText,
  onCTAPress,
  image,
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(400).delay(150)}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          {/* CTA Button */}
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={onCTAPress}
            accessibilityLabel={ctaText}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>{ctaText}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>
        
        {/* Illustration */}
        {image && (
          <Image 
            source={image}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: homeColors.promoCardBg,
    borderWidth: 1,
    borderColor: homeColors.promoCardBorder,
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  ctaText: {
    ...typography.bodyBold,
    color: colors.blue,
    marginRight: spacing.xs,
  },
  image: {
    width: 100,
    height: 100,
  },
});
