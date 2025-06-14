import axios from 'axios';

const API_BASE_URL = 'https://z-learn-study-portal-backend.onrender.com/api';

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