import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import { homeColors } from '../../constants/home.constants';
import { NotificationBadge } from '../navigation/NotificationBadge';

interface HomeHeaderProps {
  userName: string;
  greeting: string;
  notificationCount?: number;
  onNotificationPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  greeting,
  notificationCount = 0,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.userName}>{userName} 👋</Text>
      </View>
      
      {/* Notification Icon */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        accessibilityLabel={`Notifications, ${notificationCount} unread`}
        accessibilityRole="button"
      >
        <Ionicons name="notifications-outline" size={24} color={colors.black} />
        {notificationCount > 0 && (
          <NotificationBadge count={notificationCount} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: homeColors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: homeColors.headerBorder,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h1,
    color: colors.black,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
});
