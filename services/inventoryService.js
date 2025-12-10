import { apiClient } from '../lib/axios.js';

export const inventoryService = {
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/products/${id}`);
  }
};