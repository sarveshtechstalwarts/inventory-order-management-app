import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/common/StatusBadge';
import Loading from '@/components/common/Loading';

const statusSteps = [
  'created',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'closed',
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load order',
          severity: 'error',
        })
      );
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await orderService.updateOrderStatus(id, newStatus);
      dispatch(
        addNotification({
          message: 'Order status updated successfully',
          severity: 'success',
        })
      );
      fetchOrder();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to update order status',
          severity: 'error',
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return null;
  }

  const currentStepIndex = statusSteps.indexOf(order.status);
  const nextStatus = statusSteps[currentStepIndex + 1];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
        >
          Back
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Order #{order.orderNumber}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Stepper activeStep={currentStepIndex} sx={{ mt: 2 }}>
                {statusSteps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{step.charAt(0).toUpperCase() + step.slice(1)}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {nextStatus && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : `Mark as ${nextStatus}`}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product?.name || '-'}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <StatusBadge status={order.status} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">{order.customerName}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer Email
                  </Typography>
                  <Typography variant="body1">
                    {order.customerEmail || '-'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;
