import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMovements, setFilters } from '@/store/slices/inventorySlice';
import { addNotification } from '@/store/slices/uiSlice';
import { inventoryService } from '@/services/inventoryService';
import DataTable from '@/components/common/DataTable';
import { formatDateTime } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const StockMovements = () => {
  const dispatch = useAppDispatch();
  const { movements, filters, loading } = useAppSelector(
    (state) => state.inventory
  );

  useEffect(() => {
    fetchMovements();
  }, [filters]);

  const fetchMovements = async () => {
    try {
      const response = await inventoryService.getStockMovements(filters);
      dispatch(setMovements(response.data || response));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load stock movements',
          severity: 'error',
        })
      );
    }
  };

  const columns = [
    {
      id: 'productName',
      label: 'Product',
      render: (value, row) => row.product?.name || '-',
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      render: (value, row) => row.warehouse?.name || '-',
    },
    {
      id: 'type',
      label: 'Type',
      render: (value) => (value === 'add' ? 'Added' : 'Removed'),
    },
    {
      id: 'quantity',
      label: 'Quantity',
      align: 'right',
    },
    {
      id: 'reason',
      label: 'Reason',
    },
    {
      id: 'timestamp',
      label: 'Date',
      render: (value) => formatDateTime(value),
    },
    {
      id: 'user',
      label: 'User',
      render: (value, row) => row.user?.name || '-',
    },
  ];

  if (loading && movements.length === 0) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Stock Movements
      </Typography>
      <DataTable columns={columns} rows={movements} />
    </Box>
  );
};

export default StockMovements;
