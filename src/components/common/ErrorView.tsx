import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import Button from './Button';

interface ErrorViewProps {
  /** Error title (e.g., "Connection Failed") */
  title: string;
  /** Error detail message */
  message: string;
  /** Callback for the retry button */
  onRetry: () => void;
}

/**
 * Error state display with icon, title, message, and retry CTA.
 * Used when network calls fail, sessions expire, etc.
 */
export default function ErrorView({ title, message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons
        name="alert-circle-outline"
        size={56}
        color={colors.danger}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button
        title="Retry"
        onPress={onRetry}
        variant="primary"
        accessibilityLabel="Retry loading"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
});
