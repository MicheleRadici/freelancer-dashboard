import { useAppDispatch, useAppSelector } from './useRedux';
import { loginUser, registerUser, logoutUser } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return await dispatch(loginUser({ email, password }));
  };

  const register = async (name: string, email: string, password: string) => {
    return await dispatch(registerUser({ name, email, password }));
  };

  const signOut = async () => {
    return await dispatch(logoutUser());
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
