import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';

interface EditProfileFormProps {
  initialName: string;
  phone: string;
  onSave: (name: string) => void;
  isLoading: boolean;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialName,
  phone,
  onSave,
  isLoading,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setError('');
    onSave(trimmed);
  };

  const hasChanged = name.trim() !== initialName;

  return (
    <View style={styles.container}>
      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Full Name</Text>
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
          <Ionicons name="person-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textMuted}
            editable={!isLoading}
            autoFocus
          />
          {name.length > 0 && (
            <TouchableOpacity onPress={() => setName('')} disabled={isLoading}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Phone Field (read-only) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={[styles.inputContainer, styles.readOnlyInput]}>
          <Ionicons name="call-outline" size={20} color={colors.textMuted} />
          <Text style={styles.readOnlyText}>{phone}</Text>
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
          </View>
        </View>
        <Text style={styles.helperText}>
          Phone number cannot be changed. Contact support for assistance.
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          (!hasChanged || isLoading) && styles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={!hasChanged || isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <>
            <Ionicons name="checkmark" size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  readOnlyText: {
    flex: 1,
    ...typography.body,
    color: colors.textMuted,
  },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 16,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
