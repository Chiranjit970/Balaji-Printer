import React, { type ReactNode } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants';

interface SafeContainerProps {
  /** Screen content */
  children: ReactNode;
  /** Background color override (default: white) */
  backgroundColor?: string;
}

/**
 * Safe area wrapper for all screens.
 * Handles safe area insets on native, renders a plain View on web.
 * Provides consistent background color and flex behavior.
 */
export default function SafeContainer({
  children,
  backgroundColor = colors.white,
}: SafeContainerProps) {
  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <Container style={[styles.container, { backgroundColor }]}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
