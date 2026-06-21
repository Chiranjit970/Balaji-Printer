import React from 'react';
import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="cart" />
      <Stack.Screen name="address-select" />
      <Stack.Screen name="address-form" />
      <Stack.Screen name="review" />
      <Stack.Screen name="payment" />
      <Stack.Screen
        name="processing"
        options={{ gestureEnabled: false }} // Prevent back swipes during processing
      />
      <Stack.Screen
        name="failed"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="confirmation"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
