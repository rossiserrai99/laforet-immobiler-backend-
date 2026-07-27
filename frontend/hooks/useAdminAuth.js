import { useEffect, useCallback } from 'react';
import { useAdminStore } from '../store/adminStore';
import authService from '../services/auth.service';

export const useAdminAuth = () => {
  const { admin, isAuthenticated, isLoading, setAdmin, clearAdmin, setLoading } = useAdminStore();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      if (data?.token && typeof window !== 'undefined') {
        localStorage.setItem('laforet_token', data.token);
        const isHttps = window.location.protocol === 'https:';
        document.cookie = `laforet_token=${data.token}; path=/; max-age=604800; SameSite=Lax${isHttps ? '; Secure' : ''}`;
      }
      setAdmin(data.admin);
      return { success: true };
    } catch (error) {
      clearAdmin();
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la connexion' 
      };
    }
  }, [setLoading, setAdmin, clearAdmin]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore errors during logout
    } finally {
      clearAdmin();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  }, [clearAdmin]);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authService.getMe();
      setAdmin(data.admin);
    } catch (error) {
      clearAdmin();
    }
  }, [setLoading, setAdmin, clearAdmin]);

  return {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    fetchMe
  };
};
