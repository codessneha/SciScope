import { create } from 'zustand';
import chatService from '../services/chatService';

const useChatStore = create((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  error: null,

  createSession: async (sessionData) => {
    set({ loading: true, error: null });
    try {
      const data = await chatService.createSession(sessionData);
      set((state) => ({
        sessions: [data.data, ...state.sessions],
        currentSession: data.data,
        loading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create session',
        loading: false,
      });
      throw error;
    }
  },

  getSessions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await chatService.getSessions();
      set({
        sessions: data.data,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch sessions',
        loading: false,
      });
      throw error;
    }
  },

  setCurrentSession: async (sessionId) => {
    set({ loading: true, error: null });
    try {
      const data = await chatService.getSession(sessionId);
      const messages = await chatService.getMessages(sessionId);
      set({
        currentSession: data.data,
        messages: messages.data,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch session',
        loading: false,
      });
      throw error;
    }
  },

  askQuestion: async (question, paperIds) => {
    const { currentSession } = get();
    if (!currentSession) {
      throw new Error('No active session');
    }

    set({ loading: true, error: null });
    try {
      const data = await chatService.askQuestion(currentSession._id, {
        question,
        paperIds,
      });
      set((state) => ({
        messages: [...state.messages, data.data],
        loading: false,
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to get answer',
        loading: false,
      });
      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    set({ loading: true, error: null });
    try {
      await chatService.deleteSession(sessionId);
      set((state) => ({
        sessions: state.sessions.filter(s => s._id !== sessionId),
        currentSession: state.currentSession?._id === sessionId ? null : state.currentSession,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete session',
        loading: false,
      });
      throw error;
    }
  },

  clearMessages: () => set({ messages: [] }),

  clearError: () => set({ error: null }),
}));

export default useChatStore;