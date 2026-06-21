import { useQuery } from '@tanstack/react-query';
import { NotificationsService } from '../services/notifications.service';

export const useNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () => NotificationsService.getUnreadCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000,
    refetchInterval: 30 * 1000, // Poll every 30s
  });
};
