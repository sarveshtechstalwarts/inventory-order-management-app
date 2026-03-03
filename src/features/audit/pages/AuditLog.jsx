import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { auditService } from '@/services/auditService';
import DataTable from '@/components/common/DataTable';
import { formatDateTime } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const AuditLog = () => {
  const dispatch = useAppDispatch();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    userId: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAuditLogs(filters);
      setLogs(response.data || response);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to load audit logs',
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleExport = async () => {
    try {
      const blob = await auditService.exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      dispatch(
        addNotification({
          message: 'Audit logs exported successfully',
          severity: 'success',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Failed to export audit logs',
          severity: 'error',
        })
      );
    }
  };

  const columns = [
    {
      id: 'timestamp',
      label: 'Timestamp',
      render: (value) => formatDateTime(value),
    },
    {
      id: 'user',
      label: 'User',
      render: (value, row) => row.user?.name || '-',
    },
    {
      id: 'entityType',
      label: 'Entity Type',
    },
    {
      id: 'action',
      label: 'Action',
    },
    {
      id: 'entityId',
      label: 'Entity ID',
    },
    {
      id: 'description',
      label: 'Description',
    },
  ];

  if (loading && logs.length === 0) {
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
        <Typography variant="h4">Audit Log</Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Entity Type"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.entityType || ''}
          onChange={(e) => handleFilterChange('entityType', e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="product">Product</MenuItem>
          <MenuItem value="order">Order</MenuItem>
          <MenuItem value="inventory">Inventory</MenuItem>
          <MenuItem value="supplier">Supplier</MenuItem>
        </TextField>
        <TextField
          select
          label="Action"
          size="small"
          sx={{ minWidth: 200 }}
          value={filters.action || ''}
          onChange={(e) => handleFilterChange('action', e.target.value)}
        >
          <MenuItem value="">All Actions</MenuItem>
          <MenuItem value="create">Create</MenuItem>
          <MenuItem value="update">Update</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
        </TextField>
      </Box>

      <DataTable columns={columns} rows={logs} />
    </Box>
  );
};

export default AuditLog;
