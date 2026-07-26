import api from '../lib/api';

const leadService = {
  create: async (data) => {
    const response = await api.post('/leads', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/leads');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};

export default leadService;
