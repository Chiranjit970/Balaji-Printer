import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';

interface OrderActionButtonsProps {
  order: Order;
  onDownloadInvoice: () => void;
  onNeedHelp: () => void;
  isDownloading?: boolean;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  order,
  onDownloadInvoice,
  onNeedHelp,
  isDownloading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Download Invoice Button */}
      <TouchableOpacity
        style={[styles.button, styles.invoiceButton]}
        onPress={onDownloadInvoice}
        disabled={isDownloading}
        activeOpacity={0.7}
      >
        {isDownloading ? (
          <ActivityIndicator size="small" color={colors.blue} />
        ) : (
          <>
            <Ionicons name="download-outline" size={18} color={colors.blue} />
            <Text style={styles.invoiceText}>Download Invoice</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Need Help Button */}
      <TouchableOpacity
        style={[styles.button, styles.helpButton]}
        onPress={onNeedHelp}
        activeOpacity={0.7}
      >
        <Ionicons name="headset-outline" size={18} color={colors.black} />
        <Text style={styles.helpText}>Need Help?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  invoiceButton: {
    borderColor: colors.blue,
    backgroundColor: colors.white,
  },
  invoiceText: {
    ...typography.button,
    color: colors.blue,
  },
  helpButton: {
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  helpText: {
    ...typography.button,
    color: colors.black,
  },
});
