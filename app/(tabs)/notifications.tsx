import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/common/EmptyState';
import { colors } from '../../src/constants';
import { StyleSheet } from 'react-native';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="notifications-off-outline"
        title="No Notifications"
        message="We'll notify you when there are updates about your orders or new offers"
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
