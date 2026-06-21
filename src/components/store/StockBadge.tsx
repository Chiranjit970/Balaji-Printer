import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants';

interface StockBadgeProps {
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockLabel: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stockStatus,
  stockLabel,
}) => {
  const getColors = () => {
    switch (stockStatus) {
      case 'in_stock':
        return { text: colors.success, dot: colors.success };
      case 'low_stock':
        return { text: colors.warning, dot: colors.warning };
      case 'out_of_stock':
        return { text: colors.danger, dot: colors.danger };
      default:
        return { text: colors.textMuted, dot: colors.border };
    }
  };

  const { text: textColor, dot: dotColor } = getColors();

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: textColor }]}>{stockLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
});
