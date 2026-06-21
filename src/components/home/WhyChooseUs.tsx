import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SectionHeader } from './SectionHeader';
import { FeatureCard } from './FeatureCard';
import { spacing } from '../../constants';

interface WhyChooseUsProps {
  features: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ features }) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(400).delay(350)}
      style={styles.container}
    >
      <SectionHeader
        title="Why Choose Us"
        subtitle="Your trusted printing partner"
      />
      
      <View style={styles.grid}>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 80}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
