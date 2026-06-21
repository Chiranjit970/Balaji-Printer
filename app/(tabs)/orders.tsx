import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SafeContainer from '../../src/components/layouts/SafeContainer';
import { typography, colors } from '../../src/constants';

/**
 * Orders screen placeholder (Phase 6).
 */
export default function OrdersScreen() {
  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Orders Screen</Text>
        <Text style={styles.subtitle}>Phase 6 – Coming Soon</Text>
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
