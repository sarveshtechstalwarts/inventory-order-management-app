import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { inventoryService } from '@/services/inventoryService';
import { productService } from '@/services/productService';
import { stockAdjustmentSchema } from '@/utils/validators';
import FormSelect from '@/components/common/FormSelect';
import FormTextField from '@/components/common/FormTextField';
import Loading from '@/components/common/Loading';

const StockAdjustment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: '',
      warehouseId: '',
      quantity: '',
      reason: '',
      type: 'add',
    },
  });

  const adjustmentType = watch('type');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, warehousesData] = await Promise.all([
        productService.getProducts(),
        inventoryService.getWarehouses(),
      ]);
      setProducts(
        (productsData.data || productsData).map((p) => ({
          value: p.id,
          label: `${p.name} (${p.sku})`,
        }))
      );
      setWarehouses(
        warehousesData.map((w) => ({
          value: w.id,
          label: w.name,
        }))
      );
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load data',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await inventoryService.adjustStock(data);
      dispatch(
        addNotification({
          message: 'Stock adjusted successfully',
          severity: 'success',
        })
      );
      navigate('/inventory');
    } catch (error) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || 'Failed to adjust stock',
          severity: 'error',
        })
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Stock Adjustment
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormSelect
                  control={control}
                  name="productId"
                  label="Product"
                  options={products}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormSelect
                  control={control}
                  name="warehouseId"
                  label="Warehouse"
                  options={warehouses}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormSelect
                  control={control}
                  name="type"
                  label="Adjustment Type"
                  options={[
                    { value: 'add', label: 'Add Stock' },
                    { value: 'remove', label: 'Remove Stock' },
                  ]}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  control={control}
                  name="reason"
                  label="Reason"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/inventory')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color={adjustmentType === 'remove' ? 'error' : 'primary'}
                  >
                    {isSubmitting
                      ? 'Processing...'
                      : adjustmentType === 'add'
                        ? 'Add Stock'
                        : 'Remove Stock'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockAdjustment;
