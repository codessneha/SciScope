import api from '../utils/api';

const paperService = {
  // Search papers from external APIs
  searchPapers: async (query, source = 'arxiv', limit = 10) => {
    const response = await api.get('/papers/search', {
      params: { query, source, limit },
    });
    return response.data;
  },

  // Add paper to database
  addPaper: async (paperData) => {
    const response = await api.post('/papers', paperData);
    return response.data;
  },

  // Get all papers with pagination
  getPapers: async (page = 1, limit = 10) => {
    const response = await api.get('/papers', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single paper
  getPaper: async (id) => {
    const response = await api.get(`/papers/${id}`);
    return response.data;
  },

  // Update paper
  updatePaper: async (id, paperData) => {
    const response = await api.put(`/papers/${id}`, paperData);
    return response.data;
  },

  // Delete paper
  deletePaper: async (id) => {
    const response = await api.delete(`/papers/${id}`);
    return response.data;
  },

  // Semantic search
  semanticSearch: async (query, limit = 10) => {
    const response = await api.post('/papers/semantic-search', {
      query,
      limit,
    });
    return response.data;
  },

  // Get paper by arXiv ID
  getPaperByArxivId: async (arxivId) => {
    const response = await api.get(`/papers/arxiv/${arxivId}`);
    return response.data;
  },
};

export default paperService;