import axios from 'axios';

const API_BASE_URL = 'https://z-learn-study-portal-backend.onrender.com/api';

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

export const register = async (userData: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, {
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirm_password
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Registration error:', error.response?.data.email);
      throw new Error(
        error.response?.data?.email || 
        error.response?.data?.detail || 
        'Registration failed'
      );
    }
    
  }
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