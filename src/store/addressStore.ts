import { create } from 'zustand';
import { Address } from '../types/address.types';

interface AddressStore {
  // Selected address for current checkout
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  clearSelectedAddress: () => void;

  // Edit mode (address form)
  editingAddress: Address | null;
  setEditingAddress: (address: Address | null) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  clearSelectedAddress: () => set({ selectedAddress: null }),

  editingAddress: null,
  setEditingAddress: (address) => set({ editingAddress: address }),
}));
