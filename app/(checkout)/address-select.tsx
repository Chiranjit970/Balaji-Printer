import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAddresses, useDeleteAddress } from '../../src/hooks/useAddresses';
import { useAddressStore } from '../../src/store/addressStore';
import { colors, spacing, typography } from '../../src/constants';

// Checkout Components
import { CheckoutHeader } from '../../src/components/checkout/CheckoutHeader';
import { AddressCard } from '../../src/components/checkout/AddressCard';
import { CheckoutStickyBar } from '../../src/components/checkout/CheckoutStickyBar';
import { EmptyState } from '../../src/components/common/EmptyState';
import { Address } from '../../src/types/address.types';

export default function AddressSelectScreen() {
  const router = useRouter();

  // Zustand State
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);
  const setEditingAddress = useAddressStore((s) => s.setEditingAddress);

  // Queries/Mutations
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const deleteAddressMutation = useDeleteAddress();

  // Auto-select default address on mount if no selection is made yet
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    router.push({
      pathname: '/(checkout)/address-form',
      params: { mode: 'edit', id: address.id },
    });
  };

  const handleDeleteAddress = (id: string, label: string) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete your saved "${label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAddressMutation.mutate(id, {
              onSuccess: () => {
                if (selectedAddress?.id === id) {
                  setSelectedAddress(null);
                }
              },
            });
          },
        },
      ]
    );
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    router.push({
      pathname: '/(checkout)/address-form',
      params: { mode: 'add' },
    });
  };

  const handleContinue = () => {
    if (selectedAddress) {
      router.push('/(checkout)/review');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <CheckoutHeader title="Delivery Address" />
        <ActivityIndicator size="large" color={colors.blue} style={styles.spinner} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <CheckoutHeader title="Delivery Address" />
        <EmptyState
          icon="alert-circle-outline"
          title="Could Not Load Addresses"
          message="There was a problem loading your saved delivery addresses. Please try again."
          actionText="Retry"
          onActionPress={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  if (addresses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CheckoutHeader title="Delivery Address" />
        <EmptyState
          icon="location-outline"
          title="No Saved Addresses"
          message="Add a delivery address to complete your checkout order."
          actionText="Add Address"
          onActionPress={handleAddNewAddress}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader title="Delivery Address" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Saved Addresses</Text>

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            isSelected={selectedAddress?.id === addr.id}
            onSelect={() => handleSelectAddress(addr)}
            onEdit={() => handleEditAddress(addr)}
            onDelete={() => handleDeleteAddress(addr.id, addr.label)}
          />
        ))}

        <View style={styles.addBtnContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNewAddress}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky footer trigger */}
      <CheckoutStickyBar
        primaryLabel="Continue to Review"
        onPrimaryPress={handleContinue}
        primaryDisabled={!selectedAddress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  spinner: {
    marginTop: spacing.xl,
  },
  scrollContent: {
    paddingVertical: spacing.md,
    paddingBottom: 100,
  },
  heading: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  addBtnContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.white,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
});
