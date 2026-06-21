import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../services/store.service';
import { SortOption, SearchFilters } from '../types/store.types';

export const useSearchProducts = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({});

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['search', debouncedQuery, sortBy, filters],
    queryFn: () =>
      StoreService.searchProducts({ query: debouncedQuery, sortBy, filters }),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });

  return {
    query,
    setQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    results: data?.products || [],
    totalCount: data?.total || 0,
    isLoading,
    isError,
    refetch,
  };
};
