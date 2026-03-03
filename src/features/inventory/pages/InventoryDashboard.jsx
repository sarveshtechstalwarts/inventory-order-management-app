import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setStockLevels,
  setLowStockItems,
  setWarehouses,
  setFilters,
} from '@/store/slices/inventorySlice';
import { addNotification } from '@/store/slices/uiSlice';
import { inventoryService } from '@/services/inventoryService';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import Loading from '@/components/common/Loading';

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { stockLevels, lowStockItems, warehouses, filters, loading } =
    useAppSelector((state) => state.inventory);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  useEffect(() => {
    fetchData();
  }, [filters.warehouseId]);

  const fetchData = async () => {
    try {
      dispatch(setFilters({ warehouseId: selectedWarehouse || null }));
      const [stockData, lowStockData, warehousesData] = await Promise.all([
        inventoryService.getStockLevels(selectedWarehouse || null),
        inventoryService.getLowStockItems(),
        inventoryService.getWarehouses(),
      ]);
      dispatch(setStockLevels(stockData));
      dispatch(setLowStockItems(lowStockData));
      dispatch(setWarehouses(warehousesData));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load inventory data',
          severity: 'error',
        })
      );
    }
  };

  const handleWarehouseChange = (e) => {
    const value = e.target.value;
    setSelectedWarehouse(value);
    dispatch(setFilters({ warehouseId: value || null }));
    fetchData();
  };

  const columns = [
    {
      id: 'productName',
      label: 'Product',
      render: (value, row) => row.product?.name || '-',
    },
    {
      id: 'sku',
      label: 'SKU',
      render: (value, row) => row.product?.sku || '-',
    },
    {
      id: 'warehouse',
      label: 'Warehouse',
      render: (value, row) => row.warehouse?.name || 'All',
    },
    {
      id: 'quantity',
      label: 'Quantity',
      align: 'right',
    },
    {
      id: 'status',
      label: 'Status',
      render: (value, row) => {
        if (row.quantity <= 0) return <StatusBadge status="out_of_stock" />;
        if (row.quantity <= row.reorderLevel)
          return <StatusBadge status="low_stock" />;
        return <StatusBadge status="in_stock" />;
      },
    },
  ];

  if (loading && stockLevels.length === 0) {
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
        <Typography variant="h4">Inventory</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/inventory/adjust')}
        >
          Adjust Stock
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Warning color="error" />
                <Typography variant="h6">Low Stock Items</Typography>
              </Box>
              <Typography variant="h3">{lowStockItems.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Warehouse"
          size="small"
          sx={{ minWidth: 200 }}
          value={selectedWarehouse}
          onChange={handleWarehouseChange}
        >
          <MenuItem value="">All Warehouses</MenuItem>
          {warehouses.map((wh) => (
            <MenuItem key={wh.id} value={wh.id}>
              {wh.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable columns={columns} rows={stockLevels} />
    </Box>
  );
};

export default InventoryDashboard;
