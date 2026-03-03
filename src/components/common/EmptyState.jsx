import { Box, Typography } from '@mui/material';
import { Inbox } from '@mui/icons-material';

const EmptyState = ({ message = 'No data available', icon: Icon = Inbox }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        color: 'text.secondary',
      }}
    >
      <Icon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};

export default EmptyState;
