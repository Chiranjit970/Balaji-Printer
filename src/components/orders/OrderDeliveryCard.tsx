import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Address } from '../../types/address.types';
import { colors, spacing, typography } from '../../constants';

interface OrderDeliveryCardProps {
  address: Address;
  onCopy: () => void;
}

export const OrderDeliveryCard: React.FC<OrderDeliveryCardProps> = ({
  address,
  onCopy,
}) => {
  const line2Text = address.line2 ? `, ${address.line2}` : '';
  const landmarkText = address.landmark ? ` (Near ${address.landmark})` : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity onPress={onCopy} activeOpacity={0.6}>
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>{address.name}</Text>
        <Text style={styles.addressLine}>
          {address.line1}{line2Text}{landmarkText}
        </Text>
        <Text style={styles.addressLine}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
        <Text style={styles.phone}>Phone: {address.phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
  },
  copyText: {
    ...typography.bodyBold,
    color: colors.blue,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: 4,
  },
  name: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
  },
  addressLine: {
    ...typography.body,
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
  },
  phone: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
