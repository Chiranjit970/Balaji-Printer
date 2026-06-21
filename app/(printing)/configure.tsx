import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { WizardLayout } from '../../src/components/features/printing/WizardLayout';
import { SelectableCard } from '../../src/components/features/printing/SelectableCard';
import { Stepper } from '../../src/components/features/printing/Stepper';
import { usePrintStore } from '../../src/store/printStore';
import type { ColorOption, PaperSizeOption, PrintSidesOption, BindingOption } from '../../src/types/print.types';

export default function ConfigureScreen() {
  const router = useRouter();
  const { job, setOptions } = usePrintStore();
  const { options, price } = job;

  const handleNext = () => {
    router.push('/(printing)/review');
  };

  return (
    <WizardLayout
      currentStep={3}
      totalSteps={4}
      title="Print Settings"
      subtitle="Customize how you want your document printed."
      primaryActionTitle="Review & Add to Cart"
      onPrimaryAction={handleNext}
      footerContent={
        <View style={styles.pricePreview}>
          <Text style={styles.pricePreviewLabel}>Estimated Total</Text>
          <Text style={styles.pricePreviewValue}>₹{price.total}</Text>
        </View>
      }
    >
      {/* Color Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color</Text>
        <SelectableCard
          title="Black & White"
          subtitle="Best for text documents"
          icon="document-text-outline"
          isSelected={options.color === 'Black & White'}
          onSelect={() => setOptions({ color: 'Black & White' as ColorOption })}
        />
        <SelectableCard
          title="Color"
          subtitle="Best for images and presentations"
          icon="color-palette-outline"
          isSelected={options.color === 'Color'}
          onSelect={() => setOptions({ color: 'Color' as ColorOption })}
        />
      </View>

      {/* Paper Size */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paper Size</Text>
        <SelectableCard
          title="A4 Size"
          subtitle="Standard letter size"
          isSelected={options.paperSize === 'A4'}
          onSelect={() => setOptions({ paperSize: 'A4' as PaperSizeOption })}
        />
        <SelectableCard
          title="A3 Size"
          subtitle="Large poster size"
          isSelected={options.paperSize === 'A3'}
          onSelect={() => setOptions({ paperSize: 'A3' as PaperSizeOption })}
        />
        <SelectableCard
          title="Letter Size"
          subtitle="US standard"
          isSelected={options.paperSize === 'Letter'}
          onSelect={() => setOptions({ paperSize: 'Letter' as PaperSizeOption })}
        />
      </View>

      {/* Print Sides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Print Sides</Text>
        <SelectableCard
          title="Single Sided"
          subtitle="Printed on one side only"
          icon="document-outline"
          isSelected={options.sides === 'Single Side'}
          onSelect={() => setOptions({ sides: 'Single Side' as PrintSidesOption })}
        />
        <SelectableCard
          title="Double Sided"
          subtitle="Printed on both sides (Saves 20%)"
          icon="documents-outline"
          isSelected={options.sides === 'Double Side'}
          onSelect={() => setOptions({ sides: 'Double Side' as PrintSidesOption })}
        />
      </View>

      {/* Binding */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Binding</Text>
        <SelectableCard
          title="No Binding"
          subtitle="Loose sheets"
          isSelected={options.binding === 'No Binding'}
          onSelect={() => setOptions({ binding: 'No Binding' as BindingOption })}
        />
        <SelectableCard
          title="Staple Binding"
          subtitle="Stapled at top left corner (+₹10)"
          isSelected={options.binding === 'Staple'}
          onSelect={() => setOptions({ binding: 'Staple' as BindingOption })}
        />
        <SelectableCard
          title="Spiral Binding"
          subtitle="Plastic coil binding (+₹50)"
          isSelected={options.binding === 'Spiral'}
          onSelect={() => setOptions({ binding: 'Spiral' as BindingOption })}
        />
      </View>

      {/* Copies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Copies</Text>
        <Stepper 
          value={options.copies} 
          onValueChange={(copies) => setOptions({ copies })} 
          min={1} 
          max={100} 
        />
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any specific instructions for the printer?"
          placeholderTextColor={colors.border}
          multiline
          numberOfLines={4}
          value={options.instructions}
          onChangeText={(instructions) => setOptions({ instructions })}
          maxLength={200}
        />
        <Text style={styles.charCount}>
          {options.instructions?.length || 0}/200
        </Text>
      </View>
    </WizardLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  pricePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  pricePreviewLabel: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    color: colors.textMuted,
  },
  pricePreviewValue: {
    ...typography.h2,
    color: colors.blue,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    color: colors.textPrimary,
    ...typography.body,
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
});
