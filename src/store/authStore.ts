import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  full_name?: string;
  store_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  plan: 'free' | 'pro' | 'agency';
  isLoading: boolean;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: 'free',
  isLoading: true,
  logout: () => {
    set({ user: null, plan: 'free', isLoading: false });
  },
  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/api/user/profile');
      if (data.success) {
        set({ user: data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  }
}));
