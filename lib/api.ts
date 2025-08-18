import axios from 'axios';
import { API_BASE_URL } from './constants';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and JSON content type
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      // Set JSON Content-Type automatically unless this is a FormData upload
      const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
      if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
      }
    } catch (error) {
      console.error('Error getting session for API request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const session = await getSession();
        if (session?.refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
            refresh: session.refreshToken
          });
          
          const { access } = response.data;
          // Note: In a real implementation, you'd want to update the session with the new token
          // This might require additional session management logic
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (err) {
        // Handle refresh token failure (logout user)
        console.error('Refresh token failed', err);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;