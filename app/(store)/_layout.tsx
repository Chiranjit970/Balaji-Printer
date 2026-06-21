import React from 'react';
import { Stack } from 'expo-router';

export default function StoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="search" />
      <Stack.Screen name="product/[id]" />
    </Stack>
  );
}
