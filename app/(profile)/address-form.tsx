import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useAddressStore } from '../../src/store/addressStore';
import { useAddAddress, useUpdateAddress } from '../../src/hooks/useAddresses';
import { addressSchema, AddressSchema } from '../../src/utils/validation';
import { colors, spacing, typography } from '../../src/constants';
import { ADDRESS_LABELS } from '../../src/constants/checkout.constants';
import { AddressFormFields } from '../../src/components/checkout/AddressFormFields';

export default function ProfileAddressFormScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const editingAddress = useAddressStore((s) => s.editingAddress);
  const isEditMode = !!editingAddress;

  // Update header title dynamically
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Address' : 'Add Address',
    });
  }, [isEditMode, navigation]);

  // Mutations
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();

  // Form setup
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

  // Pre-populate if editing
  useEffect(() => {
    if (isEditMode && editingAddress) {
      setValue('name', editingAddress.name);
      setValue('phone', editingAddress.phone.replace('+91 ', ''));
      setValue('line1', editingAddress.line1);
      setValue('line2', editingAddress.line2 || '');
      setValue('landmark', editingAddress.landmark || '');
      setValue('city', editingAddress.city);
      setValue('state', editingAddress.state);
      setValue('pincode', editingAddress.pincode);
      setValue('label', editingAddress.label || 'Home');
    }
  }, [isEditMode, editingAddress, setValue]);

  const onSubmit = (data: AddressSchema) => {
    const formattedData = {
      ...data,
      phone: data.phone.startsWith('+91')
        ? data.phone
        : `+91 ${data.phone.trim()}`,
    };

    if (isEditMode && editingAddress) {
      updateAddressMutation.mutate(
        { id: editingAddress.id, data: formattedData },
        { onSuccess: () => router.back() }
      );
    } else {
      addAddressMutation.mutate(formattedData, {
        onSuccess: () => router.back(),
      });
    }
  };

  const isPending = addAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Form Fields (reused from checkout) */}
          <AddressFormFields control={control} errors={errors} />

          {/* Label Chips */}
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
                      isSelected
                        ? styles.chipTextSelected
                        : styles.chipTextUnselected,
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

      {/* Save Button */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          activeOpacity={0.7}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={colors.white} />
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Save Changes' : 'Save Address'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
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
  stickyBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 16,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
