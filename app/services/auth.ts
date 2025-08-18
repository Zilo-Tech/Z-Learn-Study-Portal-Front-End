import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

// Enhanced user profile interface
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
  is_instructor?: boolean;
  is_student?: boolean;
  date_joined?: string;
  courses_enrolled?: number;
  courses_completed?: number;
  achievements?: number;
}

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login-email/`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const register = async (userData: Record<string, unknown>) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const raw = error.response?.data as unknown;
      let message = 'Registration failed';
      if (raw && typeof raw === 'object') {
        const data = raw as Record<string, unknown>;
        const emailArr = Array.isArray((data as Record<string, unknown>)['email']) ? ((data as Record<string, unknown>)['email'] as unknown[]) : undefined;
        const confirmArr = Array.isArray((data as Record<string, unknown>)['confirm_password']) ? ((data as Record<string, unknown>)['confirm_password'] as unknown[]) : undefined;
        const detail = typeof data['detail'] === 'string' ? (data['detail'] as string) : undefined;
        message = (emailArr?.[0] as string) || (confirmArr?.[0] as string) || detail || message;
      }
      throw new Error(message);
    }
    
  }
};

export const activateAccount = async (uid: string, token: string) => {
  const url = `${API_BASE_URL}/activate/${uid}/${token}/`;
  const res = await axios.get(url);
  return res.data;
};

export const getUserProfile = async (accessToken: string): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/profile/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user profile');
    }
    throw new Error('Failed to fetch user profile');
  }
};