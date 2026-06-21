import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface EmptyStateProps {
  /** Icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Main title */
  title: string;
  /** Descriptive message */
  message?: string;
}

/**
 * Placeholder component for empty data states.
 * Used when lists are empty, no results found, etc.
 */
export default function EmptyState({
  icon = 'document-text-outline',
  title,
  message,
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Ionicons
        name={icon}
        size={48}
        color={colors.textMuted}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
    opacity: 0.6,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
