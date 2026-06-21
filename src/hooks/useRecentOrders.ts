import { useQuery } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => OrdersService.getRecentOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};
