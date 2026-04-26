import os

base_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\src\store"
os.makedirs(base_dir, exist_ok=True)

stores = {
    "authStore.ts": """import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  plan: 'free' | 'pro' | 'agency';
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string, plan: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: 'free',
  token: typeof window !== 'undefined' ? localStorage.getItem('karobaar_token') : null,
  isLoading: true,
  setAuth: (user, token, plan) => {
    if (typeof window !== 'undefined') localStorage.setItem('karobaar_token', token);
    set({ user, token, plan: plan as any, isLoading: false });
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('karobaar_token');
    set({ user: null, token: null, plan: 'free', isLoading: false });
    api.post('/api/auth/logout').catch(() => {});
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
""",
    "dashboardStore.ts": """import { create } from 'zustand';
import api from '../lib/api';

interface DashboardState {
  summary: any;
  healthScore: any;
  isLoadingSummary: boolean;
  isLoadingHealth: boolean;
  fetchSummary: (period: string) => Promise<void>;
  fetchHealthScore: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  healthScore: null,
  isLoadingSummary: false,
  isLoadingHealth: false,
  fetchSummary: async (period = '30d') => {
    set({ isLoadingSummary: true });
    try {
      const { data } = await api.get(`/api/dashboard/summary?period=${period}`);
      if (data.success) set({ summary: data.data });
    } finally {
      set({ isLoadingSummary: false });
    }
  },
  fetchHealthScore: async () => {
    set({ isLoadingHealth: true });
    try {
      const { data } = await api.get('/api/dashboard/health-score');
      if (data.success) set({ healthScore: data.data });
    } finally {
      set({ isLoadingHealth: false });
    }
  }
}));
""",
    "aiStore.ts": """import { create } from 'zustand';
import api from '../lib/api';

interface AiState {
  suggestions: any[];
  isLoadingSuggestions: boolean;
  fetchSuggestions: () => Promise<void>;
  applySuggestion: (id: string) => Promise<void>;
  dismissSuggestion: (id: string) => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  suggestions: [],
  isLoadingSuggestions: false,
  fetchSuggestions: async () => {
    set({ isLoadingSuggestions: true });
    try {
      const { data } = await api.get('/api/ai/suggestions');
      if (data.success) set({ suggestions: data.data });
    } finally {
      set({ isLoadingSuggestions: false });
    }
  },
  applySuggestion: async (id: string) => {
    await api.put(`/api/ai/suggestions/${id}/apply`);
    set({ suggestions: get().suggestions.filter(s => s.id !== id) });
  },
  dismissSuggestion: async (id: string) => {
    await api.put(`/api/ai/suggestions/${id}/dismiss`);
    set({ suggestions: get().suggestions.filter(s => s.id !== id) });
  }
}));
""",
    "productsStore.ts": """import { create } from 'zustand';
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
"""
}

for file_name, content in stores.items():
    with open(os.path.join(base_dir, file_name), "w", encoding="utf-8") as f:
        f.write(content)

print("Stores generated")
