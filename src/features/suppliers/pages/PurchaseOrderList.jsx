import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setPurchaseOrders, setPOFilters } from '@/store/slices/supplierSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { supplierService } from '@/services/supplierService';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { purchaseOrders, poFilters, suppliers, loading } = useAppSelector(
    (state) => state.suppliers
  );

  useEffect(() => {
    fetchPurchaseOrders();
  }, [poFilters]);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await supplierService.getPurchaseOrders(poFilters);
      dispatch(setPurchaseOrders(response.data || response));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load purchase orders',
          severity: 'error',
        })
      );
    }
  };

  const handleFilterChange = (field, value) => {
    dispatch(setPOFilters({ [field]: value, page: 1 }));
  };

  const columns = [
    {
      id: 'orderNumber',
      label: 'Order Number',
    },
    {
      id: 'supplier',
      label: 'Supplier',
      render: (value, row) => row.supplier?.name || '-',
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
      id: 'expectedDeliveryDate',
      label: 'Expected Delivery',
      render: (value) => (value ? formatDate(value) : '-'),
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (value) => formatDate(value),
    },
  ];

  if (loading && purchaseOrders.length === 0) {
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
        <Typography variant="h4">Purchase Orders</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/suppliers/purchase-orders/new')}
        >
          Create Purchase Order
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Status"
          size="small"
          sx={{ minWidth: 200 }}
          value={poFilters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="received">Received</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
        <TextField
          select
          label="Supplier"
          size="small"
          sx={{ minWidth: 200 }}
          value={poFilters.supplierId || ''}
          onChange={(e) => handleFilterChange('supplierId', e.target.value)}
        >
          <MenuItem value="">All Suppliers</MenuItem>
          {suppliers.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable columns={columns} rows={purchaseOrders} />
    </Box>
  );
};

export default PurchaseOrderList;
