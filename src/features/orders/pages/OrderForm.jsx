import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { inventoryService } from '@/services/inventoryService';
import { orderSchema } from '@/utils/validators';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import Loading from '@/components/common/Loading';

const OrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      items: [{ productId: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchStockLevels();
  }, [watchedItems]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(
        (response.data || response).map((p) => ({
          value: p.id,
          label: `${p.name} (${p.sku})`,
          product: p,
        }))
      );
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load products',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStockLevels = async () => {
    try {
      const productIds = watchedItems
        .map((item) => item.productId)
        .filter(Boolean);
      if (productIds.length === 0) return;

      const stockData = await inventoryService.getStockLevels();
      const stockMap = {};
      stockData.forEach((stock) => {
        if (!stockMap[stock.productId]) {
          stockMap[stock.productId] = 0;
        }
        stockMap[stock.productId] += stock.quantity;
      });
      setStockLevels(stockMap);
    } catch (error) {
      // Handle error silently
    }
  };

  const onSubmit = async (data) => {
    try {
      await orderService.createOrder(data);
      dispatch(
        addNotification({
          message: 'Order created successfully',
          severity: 'success',
        })
      );
      navigate('/orders');
    } catch (error) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || 'Failed to create order',
          severity: 'error',
        })
      );
    }
  };

  const getAvailableStock = (productId) => {
    return stockLevels[productId] || 0;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create Order
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="customerName"
                  label="Customer Name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="customerEmail"
                  label="Customer Email"
                  type="email"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Available Stock</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormSelect
                              control={control}
                              name={`items.${index}.productId`}
                              label="Product"
                              options={products}
                              required
                              sx={{ minWidth: 250 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {getAvailableStock(watchedItems[index]?.productId)}
                          </TableCell>
                          <TableCell>
                            <FormTextField
                              control={control}
                              name={`items.${index}.quantity`}
                              label="Quantity"
                              type="number"
                              required
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {fields.length > 1 && (
                              <IconButton
                                onClick={() => remove(index)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  startIcon={<Add />}
                  onClick={() => append({ productId: '', quantity: '' })}
                  sx={{ mt: 2 }}
                >
                  Add Item
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Order'}
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

export default OrderForm;
