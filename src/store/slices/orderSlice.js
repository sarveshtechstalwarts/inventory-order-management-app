import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  selectedOrder: null,
  filters: {
    status: '',
    dateFrom: '',
    dateTo: '',
    customer: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(
        (o) => o.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.selectedOrder?.id === orderId) {
        state.selectedOrder.status = status;
      }
    },
  },
});

export const {
  setOrders,
  setSelectedOrder,
  setFilters,
  setLoading,
  addOrder,
  updateOrder,
  updateOrderStatus,
} = orderSlice.actions;
export default orderSlice.reducer;
