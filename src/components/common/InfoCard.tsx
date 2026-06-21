import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants';

type InfoCardVariant = 'info' | 'success' | 'warning';

interface InfoCardProps {
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Optional card title */
  title?: string;
  /** Card message text */
  message: string;
  /** Visual variant (info/success/warning) */
  variant?: InfoCardVariant;
}

const variantConfig: Record<
  InfoCardVariant,
  { bg: string; text: string }
> = {
  info: { bg: colors.surface, text: colors.textMuted },
  success: { bg: '#F0FDF4', text: colors.success },
  warning: { bg: '#FFF7ED', text: colors.warning },
};

/**
 * Reusable information card for displaying messages,
 * privacy notices, tips, and status feedback.
 */
export default function InfoCard({
  icon,
  title,
  message,
  variant = 'info',
}: InfoCardProps) {
  const config = variantConfig[variant];

  return (
    <View style={[styles.card, { backgroundColor: config.bg }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <View style={styles.textContainer}>
        {title && (
          <Text style={[styles.title, { color: config.text }]}>
            {title}
          </Text>
        )}
        <Text style={[styles.message, { color: config.text }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.caption,
    lineHeight: 18,
  },
});
