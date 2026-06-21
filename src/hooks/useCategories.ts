import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../services/store.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => StoreService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });
};
