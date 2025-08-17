import { useAuthStore } from '@/app/store';
import { useCallback } from 'react';
import { RegisterUser, LoginUser } from '@/types/auth';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    setUser,
  } = useAuthStore();

  const handleLogin = useCallback(async (credentials: LoginUser) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [login]);

  const handleRegister = useCallback(async (userData: RegisterUser) => {
    try {
      await register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [register]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken,
    clearError,
    setUser,
  };
};
