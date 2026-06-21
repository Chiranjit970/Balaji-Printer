import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddressStore } from '../../src/store/addressStore';
import { useAddAddress, useUpdateAddress } from '../../src/hooks/useAddresses';
import { addressSchema, AddressSchema } from '../../src/utils/validation';
import { colors, spacing, typography } from '../../src/constants';
import { ADDRESS_LABELS } from '../../src/constants/checkout.constants';

// Checkout Components
import { CheckoutHeader } from '../../src/components/checkout/CheckoutHeader';
import { AddressFormFields } from '../../src/components/checkout/AddressFormFields';
import { CheckoutStickyBar } from '../../src/components/checkout/CheckoutStickyBar';

export default function AddressFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: string; id: string }>();
  const mode = params.mode || 'add';

  // Zustand State
  const editingAddress = useAddressStore((s) => s.editingAddress);
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);

  // Mutations
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();

  // RHF Setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      phone: '',
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      label: 'Home',
    },
  });

  const selectedLabel = watch('label') || 'Home';

  // Pre-populate form if in edit mode
  useEffect(() => {
    if (mode === 'edit' && editingAddress) {
      setValue('name', editingAddress.name);
      setValue('phone', editingAddress.phone.replace('+91 ', '')); // strip +91 if pre-existing
      setValue('line1', editingAddress.line1);
      setValue('line2', editingAddress.line2 || '');
      setValue('landmark', editingAddress.landmark || '');
      setValue('city', editingAddress.city);
      setValue('state', editingAddress.state);
      setValue('pincode', editingAddress.pincode);
      setValue('label', editingAddress.label || 'Home');
    }
  }, [mode, editingAddress, setValue]);

  const onSubmit = (data: AddressSchema) => {
    // Format phone to standard with +91 prefix for storage
    const formattedData = {
      ...data,
      phone: data.phone.startsWith('+91')
        ? data.phone
        : `+91 ${data.phone.trim()}`,
    };

    if (mode === 'edit' && editingAddress) {
      updateAddressMutation.mutate(
        { id: editingAddress.id, data: formattedData },
        {
          onSuccess: (savedAddress) => {
            setSelectedAddress(savedAddress);
            router.back();
          },
        }
      );
    } else {
      addAddressMutation.mutate(formattedData, {
        onSuccess: (savedAddress) => {
          setSelectedAddress(savedAddress);
          router.back();
        },
      });
    }
  };

  const isPending = addAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader title={mode === 'edit' ? 'Edit Address' : 'Add New Address'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Form Fields component (Personal Info, Address Lines, City/State/Pincode) */}
          <AddressFormFields control={control} errors={errors} />

          {/* Section: Label Chips */}
          <Text style={styles.sectionHeading}>Save Address As</Text>
          <View style={styles.chipsContainer}>
            {ADDRESS_LABELS.map((lbl) => {
              const isSelected = selectedLabel === lbl;
              return (
                <TouchableOpacity
                  key={lbl}
                  style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                  onPress={() => setValue('label', lbl)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                    ]}
                  >
                    {lbl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button Sticky Bar */}
      <CheckoutStickyBar
        primaryLabel={mode === 'edit' ? 'Save Changes' : 'Save Address'}
        onPrimaryPress={handleSubmit(onSubmit)}
        primaryLoading={isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 120, // space to clear bottom sticky bar
  },
  sectionHeading: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipUnselected: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  chipTextUnselected: {
    color: colors.textMuted,
  },
  chipTextSelected: {
    color: colors.blue,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 48,
  },
});
