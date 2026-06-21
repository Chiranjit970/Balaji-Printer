import { ProfileService } from './profile.service';

export interface NotificationCount {
  unread: number;
}

export const NotificationsService = {
  /**
   * Get unread notification count
   * Delegates to ProfileService for a single source of truth
   */
  async getUnreadCount(): Promise<NotificationCount> {
    const count = await ProfileService.getUnreadCount();
    return { unread: count };
  },
};
