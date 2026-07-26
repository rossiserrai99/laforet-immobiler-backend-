import api from '../lib/api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default adminService;
