import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressService } from '../services/address.service';
import { AddressFormData } from '../types/address.types';

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => AddressService.getAddresses(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressFormData) => AddressService.addAddress(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressFormData }) =>
      AddressService.updateAddress(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AddressService.deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};
