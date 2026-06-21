import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../services/store.service';

export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => StoreService.getProduct(productId),
    staleTime: 10 * 60 * 1000,
    enabled: !!productId,
  });
};

export const useRelatedProducts = (productId: string, categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: () => StoreService.getRelatedProducts(productId, categoryId),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId && !!categoryId,
  });
};
