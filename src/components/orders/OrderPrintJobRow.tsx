import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartPrintItem } from '../../types/cart.types';
import { colors, spacing, typography } from '../../constants';

interface OrderPrintJobRowProps {
  item: CartPrintItem;
  showDivider?: boolean;
}

export const OrderPrintJobRow: React.FC<OrderPrintJobRowProps> = ({
  item,
  showDivider = true,
}) => {
  const { fileName, pageCount, copies, options, price } = item;

  // Capitalize format helper
  const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const optionDetails = [
    capitalize(options.paperSize),
    capitalize(options.color),
    capitalize(options.sides),
    options.binding && options.binding !== 'none' && options.binding !== 'No Binding'
      ? capitalize(options.binding)
      : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* PDF Icon container */}
        <View style={styles.pdfIconContainer}>
          <Ionicons name="document-text" size={20} color={colors.white} />
          <Text style={styles.pdfBadge}>PDF</Text>
        </View>

        {/* Center Details */}
        <View style={styles.centerDetails}>
          <Text numberOfLines={1} style={styles.fileName}>
            {fileName}
          </Text>
          <Text style={styles.configLine}>{optionDetails}</Text>
          <Text style={styles.pagesLine}>
            {pageCount} Page{pageCount > 1 ? 's' : ''} • {copies} Cop{copies > 1 ? 'ies' : 'y'}
          </Text>
        </View>

        {/* Right Price */}
        <Text style={styles.price}>₹{price.toFixed(2)}</Text>
      </View>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pdfIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pdfBadge: {
    position: 'absolute',
    bottom: 2,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 3,
    borderRadius: 2,
  },
  centerDetails: {
    flex: 1,
  },
  fileName: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
    marginBottom: 2,
  },
  configLine: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 14,
  },
  pagesLine: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },
  price: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.black,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
