import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../constants';
import api from '../services/api';

export const useRefreshToken = () => {
  const { setToken, setLoginTime } = useAuth();

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      const { token } = response.data;
      
      setToken(token);
      setLoginTime(Date.now());
      
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }, [setToken, setLoginTime]);

  return { refreshToken };
}; 