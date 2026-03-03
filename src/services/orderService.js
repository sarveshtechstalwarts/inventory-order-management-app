import api from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateOrder: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  getOrderStatusHistory: async (id) => {
    const response = await api.get(`/orders/${id}/history`);
    return response.data;
  },
};
