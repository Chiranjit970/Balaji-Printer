import { useQuery } from '@tanstack/react-query';
import { HomeService } from '../services/home.service';
import { useAuthStore } from '../store/authStore';

export const useHomeData = () => {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || 'Guest';
  
  return useQuery({
    queryKey: ['home', userName],
    queryFn: () => HomeService.getHomeData(userName),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
  });
};
