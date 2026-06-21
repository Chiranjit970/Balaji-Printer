import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { WizardLayout } from '../../src/components/features/printing/WizardLayout';
import { Stepper } from '../../src/components/features/printing/Stepper';
import { usePrintStore } from '../../src/store/printStore';

export default function PageCountScreen() {
  const router = useRouter();
  const file = usePrintStore((state) => state.job.file);
  const setFile = usePrintStore((state) => state.setFile);
  
  const [pages, setPages] = useState(file?.pageCount || 1);

  const handleNext = () => {
    if (file) {
      setFile({ ...file, pageCount: pages });
      router.push('/(printing)/configure');
    }
  };

  return (
    <WizardLayout
      currentStep={2}
      totalSteps={4}
      title="How many pages?"
      subtitle="We couldn't determine the page count automatically. Please enter the total number of pages."
      primaryActionTitle="Continue"
      onPrimaryAction={handleNext}
    >
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="document-text-outline" size={48} color={colors.blue} />
        </View>

        <Text style={styles.label}>Total Pages</Text>
        
        <Stepper 
          value={pages} 
          onValueChange={setPages} 
          min={1} 
          max={9999} 
        />
      </View>
      
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={24} color={colors.blue} />
        <Text style={styles.infoText}>
          Please enter the exact number of pages in your document. Incorrect page counts may delay your order.
        </Text>
      </View>
    </WizardLayout>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    flex: 1,
    ...typography.caption,
    color: colors.blue,
    marginLeft: 12,
  },
});
