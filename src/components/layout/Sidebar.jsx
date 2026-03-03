import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  LocalShipping,
  People,
  Assignment,
  History,
  Settings,
  AccountCircle,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROLES, canAccess } from '@/utils/permissions';

const drawerWidth = 260;

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Dashboard, permission: null },
  {
    label: 'Products',
    path: '/products',
    icon: Inventory,
    permission: { resource: 'products', action: 'read' },
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: LocalShipping,
    permission: { resource: 'inventory', action: 'read' },
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ShoppingCart,
    permission: { resource: 'orders', action: 'read' },
  },
  {
    label: 'Suppliers',
    path: '/suppliers',
    icon: People,
    permission: { resource: 'suppliers', action: 'read' },
  },
  {
    label: 'Returns',
    path: '/returns',
    icon: Assignment,
    permission: { resource: 'returns', action: 'read' },
  },
  {
    label: 'Audit Log',
    path: '/audit',
    icon: History,
    permission: { resource: 'audit', action: 'read' },
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleClose = () => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    return canAccess(role, item.permission.resource, item.permission.action);
  });

  const drawerContent = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory sx={{ color: 'primary.main' }} />
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Inventory App
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Management System
            </Box>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>
                  <Icon color={isActive ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/profile')}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/settings')}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
