import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { productService } from '@/services/productService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { canAccess } from '@/utils/permissions';
import { formatCurrency } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load product',
          severity: 'error',
        })
      );
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          Back
        </Button>
        {canAccess(role, 'products', 'update') && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            Edit
          </Button>
        )}
      </Box>

      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="body1">{product.sku}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {product.category?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(product.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Cost
                  </Typography>
                  <Typography variant="body1">
                    {product.cost ? formatCurrency(product.cost) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {product.description || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Stock
                </Typography>
                <Typography variant="h4" sx={{ my: 1 }}>
                  {product.totalStock || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reorder Level
                </Typography>
                <Typography variant="body1">
                  {product.reorderLevel || '-'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
