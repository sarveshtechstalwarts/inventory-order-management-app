import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, role, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    logout: handleLogout,
  };
};
