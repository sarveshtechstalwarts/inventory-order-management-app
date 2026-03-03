import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSuppliers, setFilters } from '@/store/slices/supplierSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { supplierService } from '@/services/supplierService';
import { canAccess } from '@/utils/permissions';
import { useAuth } from '@/features/auth/hooks/useAuth';
import DataTable from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loading from '@/components/common/Loading';

const SupplierList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const { suppliers, filters, loading } = useAppSelector(
    (state) => state.suppliers
  );
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchSuppliers();
  }, [filters]);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers(filters);
      dispatch(setSuppliers(response.data || response));
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load suppliers',
          severity: 'error',
        })
      );
    }
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (newLimit) => {
    dispatch(setFilters({ limit: newLimit, page: 1 }));
  };

  const handleDelete = async () => {
    try {
      await supplierService.deleteSupplier(deleteDialog.id);
      dispatch(
        addNotification({
          message: 'Supplier deleted successfully',
          severity: 'success',
        })
      );
      fetchSuppliers();
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to delete supplier',
          severity: 'error',
        })
      );
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Supplier Name',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'phone',
      label: 'Phone',
    },
    {
      id: 'contactPerson',
      label: 'Contact Person',
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/suppliers/${row.id}`)}
          >
            <Visibility />
          </IconButton>
          {canAccess(role, 'suppliers', 'update') && (
            <IconButton
              size="small"
              onClick={() => navigate(`/suppliers/${row.id}/edit`)}
            >
              <Edit />
            </IconButton>
          )}
          {canAccess(role, 'suppliers', 'delete') && (
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteDialog({ open: true, id: row.id })}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  if (loading && suppliers.length === 0) {
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
        <Typography variant="h4">Suppliers</Typography>
        {canAccess(role, 'suppliers', 'create') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/suppliers/new')}
          >
            Add Supplier
          </Button>
        )}
      </Box>

      <DataTable
        columns={columns}
        rows={suppliers}
        page={filters.page - 1}
        rowsPerPage={filters.limit}
        totalRows={suppliers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        searchable
        onSearch={handleSearch}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default SupplierList;
