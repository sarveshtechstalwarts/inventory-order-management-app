import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { returnService } from '@/services/returnService';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';
import { useState } from 'react';

const ReturnList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await returnService.getReturns();
      setReturns(response.data || response);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load returns',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      id: 'returnNumber',
      label: 'Return Number',
    },
    {
      id: 'orderNumber',
      label: 'Order Number',
      render: (value, row) => row.order?.orderNumber || '-',
    },
    {
      id: 'reason',
      label: 'Reason',
    },
    {
      id: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'refundAmount',
      label: 'Refund Amount',
      align: 'right',
      render: (value) => (value ? formatCurrency(value) : '-'),
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (value) => formatDate(value),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (value, row) => (
        <IconButton
          size="small"
          onClick={() => navigate(`/returns/${row.id}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  if (loading) {
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
        <Typography variant="h4">Returns</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/returns/new')}
        >
          Create Return
        </Button>
      </Box>

      <DataTable columns={columns} rows={returns} />
    </Box>
  );
};

export default ReturnList;
