import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  Warning,
  TrendingUp,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import { dashboardService } from '@/services/dashboardService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';

const KPICard = ({ title, value, icon: Icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Icon sx={{ fontSize: 40, color: `${color}.main` }} />
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const [kpis, setKPIs] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [kpisData, activityData] = await Promise.all([
          dashboardService.getKPIs(role),
          dashboardService.getRecentActivity(10),
        ]);
        setKPIs(kpisData);
        setRecentActivity(activityData);
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Failed to load dashboard data',
            severity: 'error',
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Products"
            value={kpis?.totalProducts || 0}
            icon={Inventory}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Low Stock Items"
            value={kpis?.lowStockItems || 0}
            icon={Warning}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Orders"
            value={kpis?.pendingOrders || 0}
            icon={ShoppingCart}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Revenue"
            value={formatCurrency(kpis?.revenue || 0)}
            icon={TrendingUp}
            color="success"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              ) : (
                recentActivity.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivity.length - 1}>
                    <ListItemText
                      primary={activity.description}
                      secondary={formatDateTime(activity.timestamp)}
                    />
                    <Chip label={activity.type} size="small" />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Orders Today
                </Typography>
                <Typography variant="h5">{kpis?.ordersToday || 0}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Stock Movements
                </Typography>
                <Typography variant="h5">{kpis?.stockMovements || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Suppliers
                </Typography>
                <Typography variant="h5">{kpis?.activeSuppliers || 0}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
