import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { config } from '../constants/config';

/**
 * Auth gate hook — manages session validation and routing.
 *
 * Call this from the splash/index screen. It:
 * 1. Initializes auth state from secure storage
 * 2. Enforces a minimum splash duration for branding
 * 3. Routes to the correct screen based on auth status
 *
 * @returns Object containing loading and error states for UI rendering.
 */
export function useAuthGate() {
  const router = useRouter();
  const { isInitializing, isAuthenticated, initError, initialize } =
    useAuthStore();
  const [minSplashDone, setMinSplashDone] = useState(false);

  // Ensure minimum splash duration for branding
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashDone(true);
    }, config.splashMinDuration);

    return () => clearTimeout(timer);
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Navigate when both splash and auth are ready
  useEffect(() => {
    if (!isInitializing && minSplashDone && !initError) {
      if (isAuthenticated) {
        router.replace('/(tabs)/print');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isInitializing, minSplashDone, isAuthenticated, initError, router]);

  return {
    isReady: !isInitializing && minSplashDone,
    hasError: !!initError,
    errorMessage: initError,
    retry: initialize,
  };
}
