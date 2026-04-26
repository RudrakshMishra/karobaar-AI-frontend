import { create } from 'zustand';
import api from '../lib/api';

interface ProductsState {
  products: any[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/api/products');
      if (data.success) set({ products: data.data });
    } finally {
      set({ isLoading: false });
    }
  }
}));
