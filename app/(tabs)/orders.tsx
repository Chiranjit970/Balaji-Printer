import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../src/components/common/EmptyState';
import { colors } from '../../src/constants';
import { StyleSheet } from 'react-native';

export default function OrdersScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="receipt-outline"
        title="No Orders Yet"
        message="Your order history will appear here once you place your first order"
        actionText="Start Printing"
        onActionPress={() => router.push('/(tabs)/index')}
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
