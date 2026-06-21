import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../constants';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  name: string | null;
  phone: string;
  createdAt?: string;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  createdAt,
  onEditPress,
}) => {
  const displayName = name || 'Set Your Name';
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const memberSince = createdAt
    ? `Member since ${format(new Date(createdAt), 'MMM yyyy')}`
    : '';

  return (
    <LinearGradient
      colors={['#1E3A5F', '#2563EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            style={styles.avatar}
          >
            <Text style={styles.initials}>{initials}</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.name, !name && styles.namePlaceholder]}>
        {displayName}
      </Text>
      <Text style={styles.phone}>{phone}</Text>
      {memberSince ? (
        <Text style={styles.memberSince}>{memberSince}</Text>
      ) : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  initials: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.white,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  name: {
    ...typography.h1,
    color: colors.white,
    marginBottom: 4,
  },
  namePlaceholder: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  phone: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  memberSince: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
