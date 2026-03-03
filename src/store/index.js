import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import productSlice from './slices/productSlice';
import inventorySlice from './slices/inventorySlice';
import orderSlice from './slices/orderSlice';
import supplierSlice from './slices/supplierSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    ui: uiSlice,
    products: productSlice,
    inventory: inventorySlice,
    orders: orderSlice,
    suppliers: supplierSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
