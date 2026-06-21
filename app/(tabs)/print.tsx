import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import SafeContainer from '../../src/components/layouts/SafeContainer';
import { typography, colors, spacing } from '../../src/constants';
import Button from '../../src/components/common/Button';

/**
 * Print screen placeholder (Phase 2).
 * Default tab — landing screen for authenticated users.
 */
export default function PrintScreen() {
  const router = useRouter();

  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Printing Journey</Text>
        <Text style={styles.subtitle}>Upload documents and get them delivered.</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Start Printing" 
            onPress={() => router.push('/(printing)/upload')} 
          />
        </View>
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
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 300,
  },
});
