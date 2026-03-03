import api from './api';

export const returnService = {
  getReturns: async (params = {}) => {
    const response = await api.get('/returns', { params });
    return response.data;
  },

  getReturnById: async (id) => {
    const response = await api.get(`/returns/${id}`);
    return response.data;
  },

  createReturn: async (data) => {
    const response = await api.post('/returns', data);
    return response.data;
  },

  updateReturn: async (id, data) => {
    const response = await api.put(`/returns/${id}`, data);
    return response.data;
  },

  processRefund: async (id, data) => {
    const response = await api.post(`/returns/${id}/refund`, data);
    return response.data;
  },
};
