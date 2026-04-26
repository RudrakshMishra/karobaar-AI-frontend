import { create } from 'zustand';
import api from '../lib/api';

interface AiState {
  suggestions: any[];
  isLoadingSuggestions: boolean;
  isGenerating: boolean;
  fetchSuggestions: () => Promise<void>;
  generateSuggestions: () => Promise<void>;
  applySuggestion: (id: string) => Promise<void>;
  dismissSuggestion: (id: string) => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  suggestions: [],
  isLoadingSuggestions: false,
  isGenerating: false,
  fetchSuggestions: async () => {
    set({ isLoadingSuggestions: true });
    try {
      const { data } = await api.get('/api/ai/suggestions');
      if (data.success) set({ suggestions: data.data });
    } finally {
      set({ isLoadingSuggestions: false });
    }
  },
  generateSuggestions: async () => {
    set({ isGenerating: true });
    try {
      const { data } = await api.post('/api/ai/generate');
      if (data.success) set({ suggestions: [...data.data, ...get().suggestions] });
    } finally {
      set({ isGenerating: false });
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
