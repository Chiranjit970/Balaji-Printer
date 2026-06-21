import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, SUPPORT_INFO } from '../../constants';

export const SupportContactCard: React.FC = () => {
  const handleCall = () => {
    const url = `tel:${SUPPORT_INFO.phone.replace(/\s/g, '')}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Cannot Make Call', 'Phone calls are not supported on this device.');
      }
    });
  };

  const handleEmail = () => {
    const url = `mailto:${SUPPORT_INFO.email}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Cannot Open Email', 'No email app is configured on this device.');
    });
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${SUPPORT_INFO.whatsapp}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Cannot Open WhatsApp', 'WhatsApp is not installed on this device.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Us</Text>

      <View style={styles.card}>
        {/* Phone */}
        <TouchableOpacity style={styles.row} onPress={handleCall} activeOpacity={0.7}>
          <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="call-outline" size={20} color={colors.success} />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Call Us</Text>
            <Text style={styles.rowValue}>{SUPPORT_INFO.phone}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Email */}
        <TouchableOpacity style={styles.row} onPress={handleEmail} activeOpacity={0.7}>
          <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="mail-outline" size={20} color={colors.blue} />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Email Us</Text>
            <Text style={styles.rowValue}>{SUPPORT_INFO.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* WhatsApp */}
        <TouchableOpacity style={styles.row} onPress={handleWhatsApp} activeOpacity={0.7}>
          <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>WhatsApp</Text>
            <Text style={styles.rowValue}>Chat with us</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Working Hours */}
      <View style={styles.hoursCard}>
        <Ionicons name="time-outline" size={18} color={colors.textMuted} />
        <View style={styles.hoursContent}>
          <Text style={styles.hoursLabel}>Working Hours</Text>
          <Text style={styles.hoursValue}>{SUPPORT_INFO.workingHours}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md - 4,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  rowValue: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  hoursContent: {
    marginLeft: spacing.sm,
  },
  hoursLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  hoursValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 2,
  },
});
