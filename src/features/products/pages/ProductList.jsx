import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setFilters, setProducts } from '@/store/slices/productSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { productService } from '@/services/productService';
import { canAccess } from '@/utils/permissions';
import { useAuth } from '@/features/auth/hooks/useAuth';
import DataTable from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loading from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatters';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const { products, categories, filters, loading } = useAppSelector(
    (state) => state.products
  );
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response = await productService.getProducts(filters);
      dispatch(setProducts(response.data || response));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load products',
          severity: 'error',
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      // Categories are stored in Redux if needed
    } catch (error) {
      // Handle error silently
    }
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (newLimit) => {
    dispatch(setFilters({ limit: newLimit, page: 1 }));
  };

  const handleSort = (columnId, order) => {
    dispatch(setFilters({ sortBy: columnId, sortOrder: order }));
  };

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteDialog.id);
      dispatch(
        addNotification({
          message: 'Product deleted successfully',
          severity: 'success',
        })
      );
      fetchProducts();
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to delete product',
          severity: 'error',
        })
      );
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Product Name',
      sortable: true,
    },
    {
      id: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      id: 'category',
      label: 'Category',
      render: (value, row) => row.category?.name || '-',
    },
    {
      id: 'price',
      label: 'Price',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      id: 'stock',
      label: 'Stock',
      align: 'right',
      render: (value, row) => row.totalStock || 0,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/products/${row.id}`)}
          >
            <Visibility />
          </IconButton>
          {canAccess(role, 'products', 'update') && (
            <IconButton
              size="small"
              onClick={() => navigate(`/products/${row.id}/edit`)}
            >
              <Edit />
            </IconButton>
          )}
          {canAccess(role, 'products', 'delete') && (
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteDialog({ open: true, id: row.id })}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  if (loading && products.length === 0) {
    return <Loading />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Products</Typography>
        {canAccess(role, 'products', 'create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/products/new')}
          >
            Add Product
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Category"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        rows={products}
        page={filters.page - 1}
        rowsPerPage={filters.limit}
        totalRows={products.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        searchable
        onSearch={handleSearch}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default ProductList;
