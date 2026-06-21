import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import type { Address } from '../../types/address.types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(address.id),
        },
      ]
    );
  };

  const fullAddress = [
    address.line1,
    address.line2,
    address.landmark,
    `${address.city}, ${address.state}`,
    address.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const labelColor = address.label === 'Home' ? colors.blue : address.label === 'Work' ? '#D97706' : colors.textMuted;
  const labelBg = address.label === 'Home' ? '#EFF6FF' : address.label === 'Work' ? '#FFFBEB' : colors.surface;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onEdit(address)}
        activeOpacity={0.9}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.labelRow}>
            <View style={[styles.labelBadge, { backgroundColor: labelBg }]}>
              <Ionicons
                name={
                  address.label === 'Home'
                    ? 'home-outline'
                    : address.label === 'Work'
                    ? 'briefcase-outline'
                    : 'location-outline'
                }
                size={14}
                color={labelColor}
              />
              <Text style={[styles.labelText, { color: labelColor }]}>
                {address.label}
              </Text>
            </View>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Ionicons name="star" size={10} color="#D97706" />
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        </View>

        {/* Address Info */}
        <Text style={styles.name}>{address.name}</Text>
        <Text style={styles.phone}>{address.phone}</Text>
        <Text style={styles.address} numberOfLines={3}>
          {fullAddress}
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          {!address.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onSetDefault(address.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="star-outline" size={16} color={colors.blue} />
              <Text style={styles.actionText}>Set Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(address)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={colors.blue} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  labelText: {
    ...typography.caption,
    fontWeight: '600',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
    gap: 3,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  phone: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 6,
  },
  address: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md - 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...typography.caption,
    color: colors.blue,
    fontWeight: '600',
  },
});
