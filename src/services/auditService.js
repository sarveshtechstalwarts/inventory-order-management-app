import api from './api';

export const auditService = {
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/audit/logs', { params });
    return response.data;
  },

  getActivityFeed: async (params = {}) => {
    const response = await api.get('/audit/activity', { params });
    return response.data;
  },

  exportAuditLogs: async (params = {}) => {
    const response = await api.get('/audit/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
