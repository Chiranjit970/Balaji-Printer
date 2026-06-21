import { create } from 'zustand';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

interface PermissionsState {
  notifications: PermissionStatus;
  requestNotificationPermission: () => Promise<void>;
}

/**
 * Permissions store — tracks device permission states.
 * Stubbed for Phase 0. Will integrate with expo-notifications in future phases.
 */
export const usePermissionsStore = create<PermissionsState>((set) => ({
  notifications: 'undetermined',

  requestNotificationPermission: async () => {
    // Future: use expo-notifications to request permission
    // import * as Notifications from 'expo-notifications';
    // const { status } = await Notifications.requestPermissionsAsync();
    // set({ notifications: status === 'granted' ? 'granted' : 'denied' });

    // Mock: grant permission
    set({ notifications: 'granted' });
  },
}));
