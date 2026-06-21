import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '../services/profile.service';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

/**
 * Mutation hook for updating user profile (name)
 */
export function useUpdateProfile() {
  const updateUserName = useAuthStore((s) => s.updateUserName);

  return useMutation({
    mutationFn: (data: { name: string }) => ProfileService.updateProfile(data),
    onSuccess: (updatedUser) => {
      if (updatedUser.name) {
        updateUserName(updatedUser.name);
      }
    },
  });
}

/**
 * Query hook for fetching notifications
 */
export function useNotifications() {
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await ProfileService.getNotifications();
      setNotifications(data);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Mutation hook for marking a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const markRead = useNotificationStore((s) => s.markRead);

  return useMutation({
    mutationFn: (id: string) => ProfileService.markNotificationRead(id),
    onSuccess: (_data, id) => {
      markRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
    },
  });
}

/**
 * Mutation hook for marking all notifications as read
 */
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return useMutation({
    mutationFn: () => ProfileService.markAllRead(),
    onSuccess: () => {
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
    },
  });
}
