import { create } from 'zustand';
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
