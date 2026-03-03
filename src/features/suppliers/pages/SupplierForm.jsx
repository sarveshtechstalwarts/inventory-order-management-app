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
import { supplierService } from '@/services/supplierService';
import { supplierSchema } from '@/utils/validators';
import FormTextField from '@/components/common/FormTextField';
import Loading from '@/components/common/Loading';

const SupplierForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchSupplier();
    }
  }, [id]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const supplier = await supplierService.getSupplierById(id);
      reset({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        contactPerson: supplier.contactPerson || '',
      });
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load supplier',
          severity: 'error',
        })
      );
      navigate('/suppliers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await supplierService.updateSupplier(id, data);
        dispatch(
          addNotification({
            message: 'Supplier updated successfully',
            severity: 'success',
          })
        );
      } else {
        await supplierService.createSupplier(data);
        dispatch(
          addNotification({
            message: 'Supplier created successfully',
            severity: 'success',
          })
        );
      }
      navigate('/suppliers');
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
        {isEdit ? 'Edit Supplier' : 'Create Supplier'}
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="name"
                  label="Supplier Name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="phone"
                  label="Phone"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormTextField
                  control={control}
                  name="contactPerson"
                  label="Contact Person"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  control={control}
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/suppliers')}
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

export default SupplierForm;
