import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [],
  purchaseOrders: [],
  selectedSupplier: null,
  selectedPurchaseOrder: null,
  filters: {
    search: '',
    page: 1,
    limit: 10,
  },
  poFilters: {
    status: '',
    supplierId: '',
    page: 1,
    limit: 10,
  },
  loading: false,
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
    setPurchaseOrders: (state, action) => {
      state.purchaseOrders = action.payload;
    },
    setSelectedSupplier: (state, action) => {
      state.selectedSupplier = action.payload;
    },
    setSelectedPurchaseOrder: (state, action) => {
      state.selectedPurchaseOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPOFilters: (state, action) => {
      state.poFilters = { ...state.poFilters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addSupplier: (state, action) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    removeSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== action.payload);
    },
    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.unshift(action.payload);
    },
    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(
        (po) => po.id === action.payload.id
      );
      if (index !== -1) {
        state.purchaseOrders[index] = action.payload;
      }
    },
  },
});

export const {
  setSuppliers,
  setPurchaseOrders,
  setSelectedSupplier,
  setSelectedPurchaseOrder,
  setFilters,
  setPOFilters,
  setLoading,
  addSupplier,
  updateSupplier,
  removeSupplier,
  addPurchaseOrder,
  updatePurchaseOrder,
} = supplierSlice.actions;
export default supplierSlice.reducer;
