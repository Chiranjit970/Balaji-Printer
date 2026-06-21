import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SafeContainer from '../../src/components/layouts/SafeContainer';
import { typography, colors } from '../../src/constants';

/**
 * Store screen placeholder (Phase 2).
 */
export default function StoreScreen() {
  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Store Screen</Text>
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
