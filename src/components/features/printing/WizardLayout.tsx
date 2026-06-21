import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import Button from '../../common/Button';

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  primaryActionTitle: string;
  onPrimaryAction: () => void;
  isPrimaryActionDisabled?: boolean;
  isPrimaryActionLoading?: boolean;
  secondaryActionTitle?: string;
  onSecondaryAction?: () => void;
  footerContent?: React.ReactNode;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  primaryActionTitle,
  onPrimaryAction,
  isPrimaryActionDisabled = false,
  isPrimaryActionLoading = false,
  secondaryActionTitle,
  onSecondaryAction,
  footerContent,
}: WizardLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 } // Extra padding for fixed footer
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        {children}
      </ScrollView>

      {/* Sticky Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {footerContent}
        <View style={styles.primaryButton}>
          <Button
            title={primaryActionTitle}
            onPress={onPrimaryAction}
            disabled={isPrimaryActionDisabled}
            loading={isPrimaryActionLoading}
          />
        </View>
        {secondaryActionTitle && onSecondaryAction && (
          <View style={styles.secondaryButton}>
            <Button
              title={secondaryActionTitle}
              onPress={onSecondaryAction}
              variant="secondary"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.textMuted,
    fontFamily: 'Inter-Medium',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 12,
  },
});
