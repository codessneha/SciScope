import api from '../utils/api';

const chatService = {
  // Create new chat session
  createSession: async (sessionData) => {
    const response = await api.post('/chat/sessions', sessionData);
    return response.data;
  },

  // Get all sessions
  getSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  },

  // Get single session
  getSession: async (id) => {
    const response = await api.get(`/chat/sessions/${id}`);
    return response.data;
  },

  // Update session
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/chat/sessions/${id}`, sessionData);
    return response.data;
  },

  // Delete session
  deleteSession: async (id) => {
    const response = await api.delete(`/chat/sessions/${id}`);
    return response.data;
  },

  // Ask question in session
  askQuestion: async (sessionId, questionData) => {
    const response = await api.post(`/chat/sessions/${sessionId}/ask`, questionData);
    return response.data;
  },

  // Get messages in session
  getMessages: async (sessionId) => {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  // Add papers to session
  addPapersToSession: async (sessionId, paperIds) => {
    const response = await api.post(`/chat/sessions/${sessionId}/papers`, {
      paperIds,
    });
    return response.data;
  },
};

export default chatService;