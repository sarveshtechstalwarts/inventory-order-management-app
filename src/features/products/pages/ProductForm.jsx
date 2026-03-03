import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { productService } from '@/services/productService';
import { productSchema } from '@/utils/validators';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import Loading from '@/components/common/Loading';

const ProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      sku: '',
      price: '',
      cost: '',
      reorderLevel: '',
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(
        response.map((cat) => ({ value: cat.id, label: cat.name }))
      );
    } catch (error) {
      // Handle error
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);
      reset({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        sku: product.sku || '',
        price: product.price || '',
        cost: product.cost || '',
        reorderLevel: product.reorderLevel || '',
      });
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

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await productService.updateProduct(id, data);
        dispatch(
          addNotification({
            message: 'Product updated successfully',
            severity: 'success',
          })
        );
      } else {
        await productService.createProduct(data);
        dispatch(
          addNotification({
            message: 'Product created successfully',
            severity: 'success',
          })
        );
      }
      navigate('/products');
    } catch (error) {
      dispatch(
        addNotification({
          message: error.response?.data?.message || 'Operation failed',
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
        {isEdit ? 'Edit Product' : 'Create Product'}
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="name"
                  label="Product Name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="sku"
                  label="SKU"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  control={control}
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormSelect
                  control={control}
                  name="categoryId"
                  label="Category"
                  options={categories}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="price"
                  label="Price"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="cost"
                  label="Cost"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="reorderLevel"
                  label="Reorder Level"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/products')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
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

export default ProductForm;
