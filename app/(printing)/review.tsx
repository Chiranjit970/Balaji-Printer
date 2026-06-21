import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { WizardLayout } from '../../src/components/features/printing/WizardLayout';
import { usePrintStore } from '../../src/store/printStore';
import { useCartStore } from '../../src/store/cartStore';

interface PriceRowProps {
  label: string;
  value: number;
  isTotal?: boolean;
  isDiscount?: boolean;
}

const PriceRow = ({ label, value, isTotal, isDiscount }: PriceRowProps) => (
  <View style={[styles.priceRow, isTotal && styles.totalRow]}>
    <Text style={[styles.priceLabel, isTotal && styles.totalLabel]}>{label}</Text>
    <Text 
      style={[
        styles.priceValue, 
        isTotal && styles.totalValue,
        isDiscount && styles.discountValue
      ]}
    >
      {isDiscount ? '-' : ''}₹{Math.abs(value)}
    </Text>
  </View>
);

export default function ReviewScreen() {
  const router = useRouter();
  const { job, resetJob } = usePrintStore();
  const addPrintJob = useCartStore((state) => state.addPrintJob);
  const { file, options, price } = job;
  
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addPrintJob({
        fileName: file?.name || 'Unknown File',
        pageCount: file?.pageCount || 1,
        copies: options.copies,
        options: {
          color: options.color,
          paperSize: options.paperSize,
          sides: options.sides,
          binding: options.binding,
        },
        price: price.total,
      });
      setIsAdding(false);
      resetJob(); // Clear current job
      router.replace('/(tabs)/');
    }, 1000);
  };

  const handleModify = () => {
    router.back();
  };

  return (
    <WizardLayout
      currentStep={4}
      totalSteps={4}
      title="Review Order"
      subtitle="Please review your print job details and pricing before adding to cart."
      primaryActionTitle="Add To Cart"
      onPrimaryAction={handleAddToCart}
      isPrimaryActionLoading={isAdding}
      secondaryActionTitle="Modify Print Settings"
      onSecondaryAction={handleModify}
    >
      {/* File Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text" size={20} color={colors.blue} />
          <Text style={styles.cardTitle}>Document Details</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.fileTitle}>{file?.name || 'Unknown File'}</Text>
          <Text style={styles.fileSubtitle}>{file?.pageCount || 1} Pages • {options.copies} Copies</Text>
        </View>
      </View>

      {/* Configuration Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="settings" size={20} color={colors.blue} />
          <Text style={styles.cardTitle}>Print Settings</Text>
        </View>
        <View style={styles.configGrid}>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Color</Text>
            <Text style={styles.configValue}>{options.color}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Paper Size</Text>
            <Text style={styles.configValue}>{options.paperSize}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Print Sides</Text>
            <Text style={styles.configValue}>{options.sides}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Binding</Text>
            <Text style={styles.configValue}>{options.binding}</Text>
          </View>
        </View>
        
        {options.instructions ? (
          <View style={styles.instructionsContainer}>
            <Text style={styles.configLabel}>Instructions:</Text>
            <Text style={styles.configValue}>{options.instructions}</Text>
          </View>
        ) : null}
      </View>

      {/* Price Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt" size={20} color={colors.blue} />
          <Text style={styles.cardTitle}>Price Breakdown</Text>
        </View>
        <View style={styles.cardContent}>
          <PriceRow label={`Base Printing Cost (${file?.pageCount || 1} pages)`} value={price.base} />
          {price.color > 0 && <PriceRow label="Color Charges" value={price.color} />}
          {price.binding > 0 && <PriceRow label="Binding Charges" value={price.binding} />}
          
          <View style={styles.divider} />
          
          <PriceRow label="Final Total" value={price.total} isTotal />
        </View>
      </View>
    </WizardLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#eff6ff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    ...typography.body,
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  fileTitle: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fileSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  configItem: {
    width: '50%',
    marginBottom: 16,
  },
  configLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  configValue: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  priceValue: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalRow: {
    paddingVertical: 12,
  },
  totalLabel: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.blue,
  },
  discountValue: {
    color: colors.success,
  },
});
