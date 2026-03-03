import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setOrders, setFilters } from '@/store/slices/orderSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { orderService } from '@/services/orderService';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, filters, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders(filters);
      dispatch(setOrders(response.data || response));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load orders',
          severity: 'error',
        })
      );
    }
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value, page: 1 }));
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ customer: value, page: 1 }));
  };

  const columns = [
    {
      id: 'orderNumber',
      label: 'Order Number',
    },
    {
      id: 'customerName',
      label: 'Customer',
    },
    {
      id: 'totalAmount',
      label: 'Total Amount',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      id: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (value) => formatDate(value),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <IconButton
          size="small"
          onClick={() => navigate(`/orders/${row.id}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (loading && orders.length === 0) {
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
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders/new')}
        >
          Create Order
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Status"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="created">Created</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="packed">Packed</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
        <TextField
          label="Date From"
          type="date"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.dateFrom || ''}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date To"
          type="date"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.dateTo || ''}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={orders}
        page={filters.page - 1}
        rowsPerPage={filters.limit}
        totalRows={orders.length}
        onPageChange={(newPage) => dispatch(setFilters({ page: newPage + 1 }))}
        onRowsPerPageChange={(newLimit) =>
          dispatch(setFilters({ limit: newLimit, page: 1 }))
        }
        searchable
        onSearch={handleSearch}
        searchPlaceholder="Search by customer..."
      />
    </Box>
  );
};

export default OrderList;
