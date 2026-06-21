import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/common/EmptyState';
import { colors } from '../../src/constants';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="person-outline"
        title="Profile Details"
        message="Manage your account, addresses, and preferences here (Coming soon)"
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
