import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { WizardLayout } from '../../src/components/features/printing/WizardLayout';
import { usePrintStore } from '../../src/store/printStore';

export default function PreviewScreen() {
  const router = useRouter();
  const file = usePrintStore((state) => state.job.file);
  const setFile = usePrintStore((state) => state.setFile);
  
  const [isProcessing, setIsProcessing] = useState(true);

  // Simulate file processing (e.g. upload to backend, page count detection)
  useEffect(() => {
    if (!file) {
      router.replace('/(printing)/upload');
      return;
    }

    const timer = setTimeout(() => {
      setIsProcessing(false);
      // Mock page count detection success (or failure)
      // If failure, we would route to 'page-count' screen here
      if (file && !file.pageCount) {
        setFile({ ...file, pageCount: 15 }); // Mocking a detected 15 pages
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [file]);

  const handleNext = () => {
    // Determine next screen. If page count is still unknown, go to page-count screen
    if (!file?.pageCount) {
      router.push('/(printing)/page-count');
    } else {
      router.push('/(printing)/configure');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <WizardLayout
      currentStep={1} // Still effectively step 1 (File Selection phase)
      totalSteps={4}
      title="File Uploaded Successfully"
      subtitle="Review your file details below."
      primaryActionTitle="Continue to Print Settings"
      onPrimaryAction={handleNext}
      isPrimaryActionDisabled={isProcessing}
      isPrimaryActionLoading={isProcessing}
      secondaryActionTitle="Replace File"
      onSecondaryAction={() => router.back()}
    >
      {/* File Card */}
      <View style={styles.fileCard}>
        <View style={styles.fileIconContainer}>
          <Ionicons 
            name={file?.type.includes('pdf') ? 'document-text' : 'image'} 
            size={32} 
            color={colors.blue} 
          />
        </View>
        
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
            {file?.name || 'Unknown File'}
          </Text>
          <Text style={styles.fileMeta}>
            {formatSize(file?.size || 0)}
            {file?.pageCount ? ` • ${file.pageCount} Pages` : ''}
          </Text>
        </View>

        {isProcessing ? (
          <ActivityIndicator color={colors.blue} />
        ) : (
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
        )}
      </View>

      {/* Processing Status / Trust */}
      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark-outline" size={24} color={colors.success} />
        <Text style={styles.infoText}>
          Your file is encrypted and securely processed. It will be automatically deleted after printing.
        </Text>
      </View>

    </WizardLayout>
  );
}

const styles = StyleSheet.create({
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    ...typography.body,
    fontFamily: 'Inter-SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fileMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4', // Light green tint
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0', // Green border
  },
  infoText: {
    flex: 1,
    ...typography.caption,
    color: '#166534', // Dark green text
    marginLeft: 12,
  },
});
