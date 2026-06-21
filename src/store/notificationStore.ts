import { create } from 'zustand';
import type { Notification, NotificationFilter } from '../types/profile.types';

interface NotificationState {
  notifications: Notification[];
  filter: NotificationFilter;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setFilter: (filter: NotificationFilter) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  getFilteredNotifications: () => Notification[];
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  filter: 'all',

  setNotifications: (notifications) => set({ notifications }),

  setFilter: (filter) => set({ filter }),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  getFilteredNotifications: () => {
    const { notifications, filter } = get();
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.type === filter);
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
