export interface NotificationCount {
  unread: number;
}

export const NotificationsService = {
  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<NotificationCount> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock: no notifications for new users
    return { unread: 0 };
  },
};
