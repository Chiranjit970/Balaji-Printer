import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EditProfileForm } from '../../src/components/profile/EditProfileForm';
import { useAuthStore } from '../../src/store/authStore';
import { useUpdateProfile } from '../../src/hooks/useProfile';
import { colors } from '../../src/constants';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const handleSave = (name: string) => {
    updateProfile.mutate(
      { name },
      {
        onSuccess: () => {
          Alert.alert('Profile Updated', 'Your name has been updated successfully.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <EditProfileForm
        initialName={user?.name || ''}
        phone={user?.phone || '+91 XXXXX XXXXX'}
        onSave={handleSave}
        isLoading={updateProfile.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
