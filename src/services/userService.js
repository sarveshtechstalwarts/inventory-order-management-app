import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  updatePreferences: async (data) => {
    const response = await api.put('/users/preferences', data);
    return response.data;
  },
};
