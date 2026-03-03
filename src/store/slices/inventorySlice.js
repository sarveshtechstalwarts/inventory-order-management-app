import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockLevels: [],
  warehouses: [],
  movements: [],
  lowStockItems: [],
  filters: {
    warehouseId: '',
    productId: '',
    page: 1,
    limit: 10,
  },
  selectedWarehouse: null,
  loading: false,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setStockLevels: (state, action) => {
      state.stockLevels = action.payload;
    },
    setWarehouses: (state, action) => {
      state.warehouses = action.payload;
    },
    setMovements: (state, action) => {
      state.movements = action.payload;
    },
    setLowStockItems: (state, action) => {
      state.lowStockItems = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateStockLevel: (state, action) => {
      const { productId, warehouseId, quantity } = action.payload;
      const stock = state.stockLevels.find(
        (s) => s.productId === productId && s.warehouseId === warehouseId
      );
      if (stock) {
        stock.quantity = quantity;
      }
    },
    addMovement: (state, action) => {
      state.movements.unshift(action.payload);
    },
  },
});

export const {
  setStockLevels,
  setWarehouses,
  setMovements,
  setLowStockItems,
  setFilters,
  setSelectedWarehouse,
  setLoading,
  updateStockLevel,
  addMovement,
} = inventorySlice.actions;
export default inventorySlice.reducer;
