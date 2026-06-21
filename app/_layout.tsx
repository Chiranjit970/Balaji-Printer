import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useFonts } from '../src/hooks/useFonts';
import { useAuthStore } from '../src/store/authStore';

// Prevent auto-hide of native splash screen
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the native splash once fonts are ready (or failed — use system fonts)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      try {
        const parsed = Linking.parse(event.url);
        console.log('[DeepLink] Parsed URL path:', parsed.path);
        if (parsed.path) {
          const parts = parsed.path.split('/');
          const ordersIdx = parts.indexOf('orders');
          if (ordersIdx !== -1 && parts[ordersIdx + 1]) {
            const orderId = parts[ordersIdx + 1];
            const { isAuthenticated, setRedirectAfterAuth } = useAuthStore.getState();
            const targetPath = `/(orders)/${orderId}`;
            if (isAuthenticated) {
              router.push(targetPath as any);
            } else {
              setRedirectAfterAuth(targetPath);
              router.replace('/(auth)/login');
            }
          }
        }
      } catch (err) {
        console.error('[DeepLink] Error handling url:', err);
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, [router]);

  if (!fontsLoaded && !fontError) {
    // Native splash remains visible while fonts load
    return null;
  }

  if (fontError) {
    console.error('[RootLayout] Font loading failed:', fontError);
    // Proceed anyway with system fonts
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(store)" />
            <Stack.Screen name="(checkout)" />
            <Stack.Screen name="(orders)" />
            <Stack.Screen name="(profile)" />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
