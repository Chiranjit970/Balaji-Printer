import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { QuickActionItem } from './QuickActionItem';
import { spacing } from '../../constants';

interface QuickActionsProps {
  actions: Array<{
    id: string;
    icon: string;
    label: string;
    route: string;
    color: string;
  }>;
  onActionPress: (route: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionPress,
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(400).delay(250)}
      style={styles.container}
    >
      {actions.map((action, index) => (
        <QuickActionItem
          key={action.id}
          icon={action.icon}
          label={action.label}
          color={action.color}
          onPress={() => onActionPress(action.route)}
          delay={index * 50}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
