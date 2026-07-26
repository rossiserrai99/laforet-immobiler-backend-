import api from '../lib/api';

const propertyService = {
  getAll: async (queryString = '') => {
    const response = await api.get(`/properties${queryString}`);
    return response.data;
  },
  
  getBySlug: async (slug) => {
    const response = await api.get(`/properties/slug/${slug}`);
    return response.data;
  },

  create: async (formData) => {
    // Use native fetch for guaranteed FormData boundary generation
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/properties`, {
      method: 'POST',
      body: formData,
      // Include credentials to send the auth cookie
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    
    return response.json();
  },

  update: async (id, formData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/properties/${id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    
    return response.json();
  },

  remove: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }
};

export default propertyService;
