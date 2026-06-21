import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../services/store.service';

export const useProducts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['products', categoryId || 'all'],
    queryFn: () => StoreService.getProducts({ categoryId }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => StoreService.getFeaturedProducts(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => StoreService.getBestSellers(),
    staleTime: 5 * 60 * 1000,
  });
};
