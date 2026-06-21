import { useMutation } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import { CreateOrderRequest } from '../types/order.types';
import { useOrderStore } from '../store/orderStore';

export const useCreateOrder = () => {
  const setPendingOrder = useOrderStore((s) => s.setPendingOrder);

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => OrderService.createOrder(request),
    onSuccess: (response) => {
      if (response.success && response.order) {
        setPendingOrder(response.order);
      }
    },
  });
};
