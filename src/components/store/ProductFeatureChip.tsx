import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface ProductFeatureChipProps {
  icon: string;
  label: string;
  description: string;
}

export const ProductFeatureChip: React.FC<ProductFeatureChipProps> = ({
  icon,
  label,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={20} color={colors.blue} style={styles.icon} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    minHeight: 76,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 12,
  },
});
