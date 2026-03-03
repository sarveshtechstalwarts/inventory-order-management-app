import api from './api';

export const inventoryService = {
  getInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  getStockLevels: async (warehouseId = null) => {
    const params = warehouseId ? { warehouseId } : {};
    const response = await api.get('/inventory/stock-levels', { params });
    return response.data;
  },

  getLowStockItems: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  adjustStock: async (data) => {
    const response = await api.post('/inventory/adjust', data);
    return response.data;
  },

  getStockMovements: async (params = {}) => {
    const response = await api.get('/inventory/movements', { params });
    return response.data;
  },

  reserveStock: async (data) => {
    const response = await api.post('/inventory/reserve', data);
    return response.data;
  },

  releaseStock: async (data) => {
    const response = await api.post('/inventory/release', data);
    return response.data;
  },

  getWarehouses: async () => {
    const response = await api.get('/inventory/warehouses');
    return response.data;
  },

  createWarehouse: async (data) => {
    const response = await api.post('/inventory/warehouses', data);
    return response.data;
  },

  updateWarehouse: async (id, data) => {
    const response = await api.put(`/inventory/warehouses/${id}`, data);
    return response.data;
  },

  deleteWarehouse: async (id) => {
    const response = await api.delete(`/inventory/warehouses/${id}`);
    return response.data;
  },
};
