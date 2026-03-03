import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/products/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/products/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/products/categories/${id}`);
    return response.data;
  },
};
