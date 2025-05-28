import { useAppDispatch, useAppSelector } from './useRedux';
import { loginUser, registerUser, logout } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    await dispatch(loginUser({ email, password }));
  };

  const register = async (name: string, email: string, password: string) => {
    await dispatch(registerUser({ name, email, password }));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    signOut
  };
};
