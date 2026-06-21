import { Stack } from 'expo-router';
import { colors, typography } from '../../src/constants';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          ...typography.h2,
          color: colors.textPrimary,
        },
        headerTintColor: colors.blue,
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="edit-profile"
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="addresses"
        options={{ title: 'My Addresses' }}
      />
      <Stack.Screen
        name="address-form"
        options={{ title: 'Add Address' }}
      />
      <Stack.Screen
        name="notifications"
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="help"
        options={{ title: 'Help & Support' }}
      />
      <Stack.Screen
        name="legal"
        options={{ title: 'Legal & Policies' }}
      />
    </Stack>
  );
}
