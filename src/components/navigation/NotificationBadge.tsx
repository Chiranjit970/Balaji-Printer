import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants';
import { homeColors } from '../../constants/home.constants';

interface NotificationBadgeProps {
  count: number;
  position?: 'top-right' | 'top-left';
  size?: 'small' | 'medium';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  position = 'top-right',
  size = 'small',
}) => {
  if (count === 0) return null;
  
  const displayCount = count > 99 ? '99+' : count.toString();
  
  const positionStyle = position === 'top-right' 
    ? styles.positionTopRight 
    : styles.positionTopLeft;
  
  const sizeStyle = size === 'small' ? styles.small : styles.medium;
  
  return (
    <View style={[styles.badge, positionStyle, sizeStyle]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: homeColors.badgeBackground,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 10,
  },
  positionTopRight: {
    top: -4,
    right: -4,
  },
  positionTopLeft: {
    top: -4,
    left: -4,
  },
  small: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
  },
  medium: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: homeColors.badgeText,
  },
});
