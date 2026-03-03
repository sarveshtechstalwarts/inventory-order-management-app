import api from './api';

export const supplierService = {
  getSuppliers: async (params = {}) => {
    const response = await api.get('/suppliers', { params });
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data) => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  updateSupplier: async (id, data) => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/suppliers/purchase-orders', { params });
    return response.data;
  },

  getPurchaseOrderById: async (id) => {
    const response = await api.get(`/suppliers/purchase-orders/${id}`);
    return response.data;
  },

  createPurchaseOrder: async (data) => {
    const response = await api.post('/suppliers/purchase-orders', data);
    return response.data;
  },

  updatePurchaseOrder: async (id, data) => {
    const response = await api.put(`/suppliers/purchase-orders/${id}`, data);
    return response.data;
  },

  updatePurchaseOrderStatus: async (id, status) => {
    const response = await api.patch(`/suppliers/purchase-orders/${id}/status`, { status });
    return response.data;
  },
};
