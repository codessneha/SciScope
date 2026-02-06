import { create } from 'zustand';
import paperService from '../services/paperService';

const usePaperStore = create((set, get) => ({
  papers: [],
  selectedPapers: [],
  searchResults: [],
  currentPaper: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  searchPapers: async (query, source = 'arxiv', limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await paperService.searchPapers(query, source, limit);
      set({
        searchResults: data.data,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Search failed',
        loading: false,
      });
      throw error;
    }
  },

  addPaper: async (paperData) => {
    set({ loading: true, error: null });
    try {
      const data = await paperService.addPaper(paperData);
      set((state) => ({
        papers: [data.data, ...state.papers],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add paper',
        loading: false,
      });
      throw error;
    }
  },

  getPapers: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await paperService.getPapers(page, limit);
      set({
        papers: data.data,
        pagination: {
          page,
          limit,
          total: data.total,
        },
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch papers',
        loading: false,
      });
      throw error;
    }
  },

  getPaper: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await paperService.getPaper(id);
      set({
        currentPaper: data.data,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch paper',
        loading: false,
      });
      throw error;
    }
  },

  togglePaperSelection: (paper) => {
    set((state) => {
      const isSelected = state.selectedPapers.some(p => p._id === paper._id);
      return {
        selectedPapers: isSelected
          ? state.selectedPapers.filter(p => p._id !== paper._id)
          : [...state.selectedPapers, paper],
      };
    });
  },

  clearSelectedPapers: () => set({ selectedPapers: [] }),

  clearSearchResults: () => set({ searchResults: [] }),

  clearError: () => set({ error: null }),
}));

export default usePaperStore;