import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface PaymentMethodCardProps {
  title: string;
  subtitle: string;
  icon: string;
  isSelected?: boolean;
  onSelect: () => void;
  apps?: readonly string[]; // support UPI apps subchips
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  title,
  subtitle,
  icon,
  isSelected = false,
  onSelect,
  apps,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.containerSelected : styles.containerUnselected,
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        {/* Left Icon */}
        <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={isSelected ? colors.white : colors.blue}
          />
        </View>

        {/* Text details */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isSelected && styles.titleSelected]}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Radio Select dot */}
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={20}
          color={isSelected ? colors.blue : colors.border}
        />
      </View>

      {/* Sub-chips for UPI apps */}
      {apps && apps.length > 0 && isSelected && (
        <View style={styles.appsRow}>
          {apps.map((app, index) => (
            <View key={index} style={styles.appChip}>
              <Ionicons name="flash-outline" size={10} color={colors.blue} style={styles.appChipIcon} />
              <Text style={styles.appChipText}>{app}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerUnselected: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    borderWidth: 2,
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  iconWrapperSelected: {
    backgroundColor: colors.blue,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.black,
  },
  titleSelected: {
    color: colors.blue,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  appsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  appChipIcon: {
    marginRight: 2,
  },
  appChipText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
  },
});
