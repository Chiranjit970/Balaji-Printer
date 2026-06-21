import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartPrintItem } from '../../types/cart.types';
import { colors, spacing, typography } from '../../constants';

interface CartPrintJobItemProps {
  item: CartPrintItem;
  onEdit: () => void;
  onRemove: () => void;
}

export const CartPrintJobItem: React.FC<CartPrintJobItemProps> = ({
  item,
  onEdit,
  onRemove,
}) => {
  const { fileName, pageCount, copies, options, price } = item;

  return (
    <View style={styles.container}>
      {/* File Info Row */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color={colors.white} />
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.fileName}>
            {fileName}
          </Text>
          <Text style={styles.details}>
            {options.paperSize} • {options.color} • {options.sides}
          </Text>
          <Text style={styles.detailsSub}>
            {pageCount} Page{pageCount > 1 ? 's' : ''} • {copies} Cop{copies > 1 ? 'ies' : 'y'}
          </Text>
        </View>

        {/* Action Options Trigger Placeholder */}
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.6}>
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Pricing Row */}
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Printing Cost</Text>
        <Text style={styles.price}>₹{price.toFixed(2)}</Text>
      </View>

      {/* Card Actions Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={16} color={colors.blue} style={styles.buttonIcon} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeButton} onPress={onRemove} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} style={styles.buttonIcon} />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.danger, // standard PDF Red color
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  fileName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: 2,
  },
  details: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 14,
  },
  detailsSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },
  menuButton: {
    padding: spacing.xs,
    position: 'absolute',
    top: -4,
    right: -8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  price: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  editText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2', // light red border
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  removeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.danger,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
