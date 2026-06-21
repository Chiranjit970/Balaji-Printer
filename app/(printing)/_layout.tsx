import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { usePrintStore } from '../../src/store/printStore';

export default function PrintingLayout() {
  const router = useRouter();
  const resetJob = usePrintStore((state) => state.resetJob);

  const handleClose = () => {
    resetJob();
    router.replace('/(tabs)/');
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
          color: colors.textPrimary,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={handleClose}
            style={{ padding: 8, marginRight: -8 }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ),
        contentStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      <Stack.Screen 
        name="upload" 
        options={{ 
          title: 'Select File',
          headerLeft: () => null, // No back button on first screen
        }} 
      />
      <Stack.Screen 
        name="preview" 
        options={{ 
          title: 'File Preview',
        }} 
      />
      <Stack.Screen 
        name="page-count" 
        options={{ 
          title: 'Page Count',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="configure" 
        options={{ 
          title: 'Print Settings',
        }} 
      />
      <Stack.Screen 
        name="review" 
        options={{ 
          title: 'Review Order',
        }} 
      />
    </Stack>
  );
}
