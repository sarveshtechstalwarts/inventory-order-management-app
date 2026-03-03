import { Chip } from '@mui/material';

const statusColors = {
  created: 'default',
  confirmed: 'info',
  packed: 'warning',
  shipped: 'primary',
  delivered: 'success',
  closed: 'success',
  cancelled: 'error',
  pending: 'warning',
  active: 'success',
  inactive: 'default',
  low_stock: 'error',
  in_stock: 'success',
  out_of_stock: 'error',
};

const StatusBadge = ({ status, label }) => {
  const color = statusColors[status?.toLowerCase()] || 'default';
  const displayLabel = label || status;

  return <Chip label={displayLabel} color={color} size="small" />;
};

export default StatusBadge;
