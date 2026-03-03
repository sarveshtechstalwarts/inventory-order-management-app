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
import { returnService } from '@/services/returnService';
import { orderService } from '@/services/orderService';
import { returnSchema } from '@/utils/validators';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import Loading from '@/components/common/Loading';

const ReturnForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(returnSchema),
    defaultValues: {
      orderId: '',
      reason: '',
      items: [{ productId: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const selectedOrderId = watch('orderId');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders({ status: 'delivered' });
      setOrders(
        (response.data || response).map((o) => ({
          value: o.id,
          label: `Order #${o.orderNumber} - ${o.customerName}`,
          order: o,
        }))
      );
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load orders',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await returnService.createReturn(data);
      dispatch(
        addNotification({
          message: 'Return request created successfully',
          severity: 'success',
        })
      );
      navigate('/returns');
    } catch (error) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || 'Failed to create return',
          severity: 'error',
        })
      );
    }
  };

  const selectedOrder = orders.find((o) => o.value === selectedOrderId)?.order;

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Create Return Request
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormSelect
                  control={control}
                  name="orderId"
                  label="Order"
                  options={orders}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  control={control}
                  name="reason"
                  label="Return Reason"
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              {selectedOrder && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Return Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Ordered Quantity</TableCell>
                          <TableCell align="right">Return Quantity</TableCell>
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
                                options={
                                  selectedOrder.items?.map((item) => ({
                                    value: item.productId,
                                    label: item.product?.name || '-',
                                  })) || []
                                }
                                required
                                sx={{ minWidth: 250 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              {
                                selectedOrder.items?.find(
                                  (item) =>
                                    item.productId ===
                                    watch(`items.${index}.productId`)
                                )?.quantity
                              }
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
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/returns')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Return'}
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

export default ReturnForm;
