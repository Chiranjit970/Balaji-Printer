import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AddressCard } from '../../src/components/profile/AddressCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useAddresses } from '../../src/hooks/useAddresses';
import { AddressService } from '../../src/services/address.service';
import { useAddressStore } from '../../src/store/addressStore';
import { colors, spacing, typography } from '../../src/constants';
import type { Address } from '../../src/types/address.types';
import { useQueryClient } from '@tanstack/react-query';

export default function AddressesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading, refetch } = useAddresses();
  const setEditingAddress = useAddressStore((s) => s.setEditingAddress);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    router.push('/(profile)/address-form' as any);
  };

  const handleDelete = async (id: string) => {
    try {
      await AddressService.deleteAddress(id);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    } catch (err) {
      console.error('[Addresses] Delete error:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await AddressService.setDefault(id);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    } catch (err) {
      console.error('[Addresses] Set default error:', err);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    router.push('/(profile)/address-form' as any);
  };

  const renderItem = ({ item }: { item: Address }) => (
    <AddressCard
      address={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSetDefault={handleSetDefault}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          addresses.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.blue}
            colors={[colors.blue]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="location-outline"
              title="No Addresses Saved"
              message="Add your first delivery address to get started with quick checkouts."
              actionText="Add Address"
              onActionPress={handleAddNew}
            />
          ) : null
        }
      />

      {/* Floating Add Button */}
      {addresses.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
