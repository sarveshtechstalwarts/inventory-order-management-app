import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { canAccess } from '@/utils/permissions';

const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredPermission = null,
  resource = null,
  action = null,
}) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermission && resource && action) {
    if (!canAccess(role, resource, action)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
