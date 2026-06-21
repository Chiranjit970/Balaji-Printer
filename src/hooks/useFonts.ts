import { useFonts as useExpoFonts } from 'expo-font';

/**
 * Font loading hook.
 * Loads the Inter font family (4 weights) using expo-font.
 *
 * @returns [fontsLoaded, fontError] tuple.
 */
export function useFonts(): [boolean, Error | null] {
  const [fontsLoaded, fontError] = useExpoFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
  });

  return [fontsLoaded, fontError];
}
