import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery,
  tagTypes: [
    'Auth',
    'Product',
    'Category',
    'Inventory',
    'Warehouse',
    'Supplier',
    'PurchaseOrder',
    'Order',
    'Return',
    'Audit',
    'User',
  ],
  endpoints: () => ({}),
});
