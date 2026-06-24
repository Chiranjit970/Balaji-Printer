import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { WizardLayout } from '../../src/components/features/printing/WizardLayout';
import { usePrintStore } from '../../src/store/printStore';

export default function UploadScreen() {
  const router = useRouter();
  const setFile = usePrintStore((state) => state.setFile);
  const file = usePrintStore((state) => state.job.file);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      let finalUri = asset.uri;

      if (Platform.OS !== 'web' && FileSystem.documentDirectory) {
        try {
          const directory = `${FileSystem.documentDirectory}picked_documents/`;
          
          // Ensure directory exists
          const dirInfo = await FileSystem.getInfoAsync(directory);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
          }
          
          // Generate a safe unique name
          const filename = `${Date.now()}_${asset.name.replace(/\s+/g, '_')}`;
          const destinationUri = `${directory}${filename}`;
          
          await FileSystem.copyAsync({
            from: asset.uri,
            to: destinationUri,
          });
          
          finalUri = destinationUri;
        } catch (copyError) {
          console.error('[UploadScreen] Failed to copy document to permanent storage:', copyError);
        }
      }

      setFile({
        uri: finalUri,
        name: asset.name,
        size: asset.size || 0,
        type: asset.mimeType || 'application/octet-stream',
        // In a real app, we'd parse the PDF or ask the server for page count here.
        // For now, we'll leave it undefined to trigger the page-count screen or mock it later.
      });
      
      router.push('/(printing)/preview');
    } catch (error) {
      console.error('Error picking document', error);
      // Show error toast in a real app
    }
  };

  const handleNext = () => {
    if (file) {
      router.push('/(printing)/preview');
    }
  };

  return (
    <WizardLayout
      currentStep={1}
      totalSteps={4}
      title="What would you like to print today?"
      subtitle="Select a document to get started."
      primaryActionTitle={file ? 'Continue' : 'Select File'}
      onPrimaryAction={file ? handleNext : handlePickDocument}
    >
      {/* Upload Zone */}
      <TouchableOpacity 
        style={styles.uploadZone} 
        onPress={handlePickDocument}
        activeOpacity={0.8}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-upload-outline" size={32} color={colors.blue} />
        </View>
        <Text style={styles.uploadTitle}>Tap to select a file</Text>
        <Text style={styles.uploadSubtitle}>Supported formats: PDF, JPG, PNG, DOCX</Text>
      </TouchableOpacity>

      {/* Trust Indicators */}
      <View style={styles.trustContainer}>
        <View style={styles.trustItem}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
          <Text style={styles.trustText}>Secure Upload</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="print-outline" size={20} color={colors.textMuted} />
          <Text style={styles.trustText}>High Quality Prints</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="flash-outline" size={20} color={colors.textMuted} />
          <Text style={styles.trustText}>Fast Processing</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.textMuted} />
          <Text style={styles.trustText}>Easy Ordering</Text>
        </View>
      </View>
    </WizardLayout>
  );
}

const styles = StyleSheet.create({
  uploadZone: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    ...typography.body,
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
    marginBottom: 4,
  },
  uploadSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  trustContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trustItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 8,
    flex: 1,
  },
});
