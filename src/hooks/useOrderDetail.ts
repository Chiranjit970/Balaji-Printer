import { useQuery } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => OrdersService.getOrder(orderId),
    staleTime: 2 * 60 * 1000,
    enabled: !!orderId,
    refetchOnWindowFocus: true,
  });
};
