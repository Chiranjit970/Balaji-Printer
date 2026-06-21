import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SafeContainer from '../../src/components/layouts/SafeContainer';
import { typography, colors } from '../../src/constants';

/**
 * Print screen placeholder (Phase 2).
 * Default tab — landing screen for authenticated users.
 */
export default function PrintScreen() {
  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Print Screen</Text>
        <Text style={styles.subtitle}>Phase 2 – Coming Soon</Text>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.black,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 8,
  },
});
