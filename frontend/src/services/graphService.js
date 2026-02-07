import api from '../utils/api';

const graphService = {
  // Generate knowledge graph
  generateGraph: async (graphData) => {
    const response = await api.post('/graph/generate', graphData);
    return response.data;
  },

  // Get user's graphs
  getUserGraphs: async () => {
    const response = await api.get('/graph');
    return response.data;
  },

  // Get single graph
  getGraph: async (id) => {
    const response = await api.get(`/graph/${id}`);
    return response.data;
  },

  // Update graph
  updateGraph: async (id, graphData) => {
    const response = await api.put(`/graph/${id}`, graphData);
    return response.data;
  },

  // Delete graph
  deleteGraph: async (id) => {
    const response = await api.delete(`/graph/${id}`);
    return response.data;
  },
};

export default graphService;