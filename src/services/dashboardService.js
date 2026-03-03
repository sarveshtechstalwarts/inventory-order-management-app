import api from './api';

export const dashboardService = {
  getKPIs: async (role) => {
    const response = await api.get('/dashboard/kpis', { params: { role } });
    return response.data;
  },

  getInventoryTrends: async (params = {}) => {
    const response = await api.get('/dashboard/inventory-trends', { params });
    return response.data;
  },

  getOrderStatistics: async (params = {}) => {
    const response = await api.get('/dashboard/order-stats', { params });
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data;
  },
};
