import { useAppDispatch, useAppSelector } from './useRedux';
import { loginUser, registerUser, logoutUser } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, profile, isAuthenticated, isLoading, error, authReady } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    return await dispatch(loginUser({ email, password }));
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    return await dispatch(registerUser({ name, email, password, role }));
  };

  const signOut = async () => {
    return await dispatch(logoutUser());
  };

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    authReady,
    login,
    register,
    signOut
  };
};
