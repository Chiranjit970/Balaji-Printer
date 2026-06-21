import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import { homeColors } from '../../constants/home.constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface QuickActionItemProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  delay?: number;
}

export const QuickActionItem: React.FC<QuickActionItemProps> = ({
  icon,
  label,
  color,
  onPress,
  delay = 0,
}) => {
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <AnimatedTouchable
      entering={FadeInDown.duration(300).delay(delay)}
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={[styles.iconContainer, { backgroundColor: homeColors.quickActionBg }]}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '22%', // ~4 items per row
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: homeColors.quickActionBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  label: {
    ...typography.caption,
    color: colors.black,
    textAlign: 'center',
  },
});
