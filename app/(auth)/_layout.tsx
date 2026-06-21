import { Stack } from 'expo-router';

/**
 * Auth stack layout for unauthenticated screens.
 * Contains login and OTP verification (Phase 1).
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
