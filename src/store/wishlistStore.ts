import { create } from 'zustand';

interface WishlistStore {
  wishlistedIds: Set<string>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistedIds: new Set<string>(),

  toggleWishlist: (productId) => {
    set((state) => {
      const newSet = new Set(state.wishlistedIds);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return { wishlistedIds: newSet };
    });
  },

  isWishlisted: (productId) => get().wishlistedIds.has(productId),

  clearWishlist: () => set({ wishlistedIds: new Set<string>() }),
}));
