import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories: [],
  filters: {
    search: '',
    category: '',
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  selectedProduct: null,
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setCategories,
  setFilters,
  setSelectedProduct,
  setLoading,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;
export default productSlice.reducer;
