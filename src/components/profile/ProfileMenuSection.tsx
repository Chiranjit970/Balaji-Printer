import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileMenuCard } from './ProfileMenuCard';
import { colors, spacing, typography } from '../../constants';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  description?: string;
  route: string;
  section: string;
  badge?: number;
}

interface ProfileMenuSectionProps {
  title: string;
  items: MenuItem[];
  onItemPress: (item: MenuItem) => void;
}

export const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({
  title,
  items,
  onItemPress,
}) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.card}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <ProfileMenuCard
              icon={item.icon}
              label={item.label}
              description={item.description}
              badge={item.badge}
              isDestructive={item.section === 'session'}
              onPress={() => onItemPress(item)}
            />
            {index < items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 70,
  },
});
