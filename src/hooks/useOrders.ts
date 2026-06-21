import { useQuery } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';
import { OrderSearchParams } from '../types/order.types';

export const useOrders = (params?: OrderSearchParams) => {
  return useQuery({
    queryKey: ['orders', params?.statusFilter || 'all', params?.query || ''],
    queryFn: () => OrdersService.getOrders(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
