import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants';

interface AuthHeaderProps {
  /** Main heading text */
  title: string;
  /** Description below the title */
  subtitle?: string;
  /** Optional illustration component between logo and title */
  illustration?: React.ReactNode;
}

/**
 * Reusable header for authentication screens.
 * Displays the Balaji Printers logo, optional illustration,
 * title, and subtitle in a centered column layout.
 */
export default function AuthHeader({
  title,
  subtitle,
  illustration,
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Balaji Printers logo"
      />

      {/* Illustration */}
      {illustration && (
        <View style={styles.illustrationContainer}>{illustration}</View>
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: spacing.lg,
  },
  illustrationContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
});
