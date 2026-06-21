import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { FormInput } from '../common/FormInput';
import { colors, spacing, typography } from '../../constants';
import { INDIAN_STATES } from '../../constants/checkout.constants';

interface AddressFormFieldsProps {
  control: any;
  errors: any;
}

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  control,
  errors,
}) => {
  const [stateModalVisible, setStateModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* SECTION 1: Personal Info */}
      <Text style={styles.sectionHeading}>Personal Information</Text>
      
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Contact Name"
            placeholder="e.g. Rohit Sharma"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            required
          />
        )}
      />

      {/* SECTION 2: Address Details */}
      <Text style={styles.sectionHeading}>Address Details</Text>
      
      <Controller
        control={control}
        name="line1"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Address Line 1"
            placeholder="Flat/House No., Building, Street"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.line1?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="line2"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Address Line 2 (Optional)"
            placeholder="Area, Colony, Sector"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.line2?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="landmark"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Landmark (Optional)"
            placeholder="e.g. Near Park, Opp. Hospital"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.landmark?.message}
          />
        )}
      />

      {/* SECTION 3: Location */}
      <Text style={styles.sectionHeading}>Location</Text>
      
      <View style={styles.twoColumnRow}>
        <View style={styles.column}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="City"
                placeholder="City"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.city?.message}
                required
              />
            )}
          />
        </View>

        <View style={styles.column}>
          {/* Custom State Dropdown Selector */}
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <View style={styles.stateDropdownContainer}>
                <Text style={styles.stateDropdownLabel}>
                  State<Text style={styles.asterisk}> *</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.stateTrigger,
                    !!errors.state?.message && styles.stateTriggerError,
                  ]}
                  onPress={() => setStateModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.stateValueText, !value && styles.statePlaceholderText]}>
                    {value || 'Select State'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
                </TouchableOpacity>
                {!!errors.state?.message && (
                  <Text style={styles.errorText}>{errors.state.message}</Text>
                )}

                {/* State Dropdown Sheet */}
                <Modal
                  visible={stateModalVisible}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setStateModalVisible(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select State</Text>
                            <TouchableOpacity onPress={() => setStateModalVisible(false)}>
                              <Ionicons name="close" size={24} color={colors.black} />
                            </TouchableOpacity>
                          </View>
                          <FlatList
                            data={INDIAN_STATES}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                              const isSelected = item === value;
                              return (
                                <TouchableOpacity
                                  style={[
                                    styles.stateOption,
                                    isSelected && styles.stateOptionSelected,
                                  ]}
                                  onPress={() => {
                                    onChange(item);
                                    setStateModalVisible(false);
                                  }}
                                  activeOpacity={0.6}
                                >
                                  <Text
                                    style={[
                                      styles.stateOptionText,
                                      isSelected && styles.stateOptionTextSelected,
                                    ]}
                                  >
                                    {item}
                                  </Text>
                                  {isSelected && (
                                    <Ionicons name="checkmark" size={18} color={colors.blue} />
                                  )}
                                </TouchableOpacity>
                              );
                            }}
                            contentContainerStyle={styles.listContent}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="pincode"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Pincode"
            placeholder="6-digit pincode"
            keyboardType="number-pad"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.pincode?.message}
            required
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeading: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
  },
  stateDropdownContainer: {
    marginBottom: spacing.md,
  },
  stateDropdownLabel: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  asterisk: {
    color: colors.danger,
  },
  stateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: spacing.sm,
  },
  stateTriggerError: {
    borderColor: colors.danger,
  },
  stateValueText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
  },
  statePlaceholderText: {
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.danger,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  stateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  stateOptionSelected: {
    backgroundColor: colors.blueLight,
  },
  stateOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  stateOptionTextSelected: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
});
