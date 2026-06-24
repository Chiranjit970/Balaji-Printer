import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { CartItem, CartProductItem, CartPrintItem } from '../types/cart.types';

interface CartStore {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  addProduct: (product: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }) => void;
  addPrintJob: (printJob: {
    fileName: string;
    pageCount: number;
    copies: number;
    options: {
      color: string;
      paperSize: string;
      sides: string;
      binding: string;
    };
    price: number;
  }) => void;
  updateProductQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    if (item.type === 'product') {
      return sum + item.price * item.quantity;
    } else {
      return sum + item.price; // print job price is already total
    }
  }, 0);
};

const calculateCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    if (item.type === 'product') {
      return sum + item.quantity;
    } else {
      return sum + 1; // print job is counted as 1 item in cart summary
    }
  }, 0);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      itemCount: 0,

      addProduct: (product) => {
        const existingItem = get().items.find(
          (item) => item.type === 'product' && item.productId === product.productId
        ) as CartProductItem | undefined;

        if (existingItem) {
          get().updateProductQuantity(
            existingItem.cartItemId,
            existingItem.quantity + product.quantity
          );
          return;
        }

        const newItem: CartProductItem = {
          cartItemId: `cart_product_${Date.now()}`,
          type: 'product',
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          addedAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedItems = [...state.items, newItem];
          return {
            items: updatedItems,
            totalAmount: calculateTotal(updatedItems),
            itemCount: calculateCount(updatedItems),
          };
        });
      },

      addPrintJob: (printJob) => {
        const newItem: CartPrintItem = {
          cartItemId: `cart_print_${Date.now()}`,
          type: 'print',
          fileName: printJob.fileName,
          pageCount: printJob.pageCount,
          copies: printJob.copies,
          options: printJob.options,
          price: printJob.price,
          addedAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedItems = [...state.items, newItem];
          return {
            items: updatedItems,
            totalAmount: calculateTotal(updatedItems),
            itemCount: calculateCount(updatedItems),
          };
        });
      },

      updateProductQuantity: (cartItemId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.cartItemId === cartItemId && item.type === 'product') {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          });
          return {
            items: updatedItems,
            totalAmount: calculateTotal(updatedItems),
            itemCount: calculateCount(updatedItems),
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.cartItemId !== cartItemId);
          return {
            items: updatedItems,
            totalAmount: calculateTotal(updatedItems),
            itemCount: calculateCount(updatedItems),
          };
        });
      },

      clearCart: () => set({ items: [], totalAmount: 0, itemCount: 0 }),
    }),
    {
      name: STORAGE_KEYS.cart,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
