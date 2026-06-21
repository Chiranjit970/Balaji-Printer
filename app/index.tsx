import React, { useEffect, useRef } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../src/constants';
import { useAuthGate } from '../src/hooks/useAuthGate';
import ErrorView from '../src/components/common/ErrorView';

/**
 * Splash / Auth Gate screen.
 * Shows brand logo with fade-in animation while:
 * 1. Fonts load (handled by _layout.tsx)
 * 2. Auth state initializes (token validation)
 * 3. Minimum splash duration elapses (1.5s branding)
 *
 * Then routes to /(tabs)/print or /(auth)/login based on session.
 */
export default function SplashIndex() {
  const { hasError, errorMessage, retry } = useAuthGate();

  // Logo fade-in animation
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo over 300ms
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fade in loader 200ms after logo
    const loaderTimer = setTimeout(() => {
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 200);

    return () => clearTimeout(loaderTimer);
  }, [logoOpacity, loaderOpacity]);

  // Show error state if initialization failed
  if (hasError) {
    return (
      <ErrorView
        title="Connection Error"
        message={errorMessage ?? 'Please check your internet and try again.'}
        onRetry={retry}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { opacity: logoOpacity }]}
        resizeMode="contain"
        accessibilityLabel="Balaji Printers logo"
      />
      <Animated.View style={{ opacity: loaderOpacity }}>
        <ActivityIndicator
          size="large"
          color={colors.blue}
          style={styles.loader}
          accessibilityLabel="Loading application"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  loader: {
    marginTop: spacing.lg,
  },
});
