import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export const verifyOTP = async (email: string, otp: string) => {
  // Adjust endpoint as per your backend
  const response = await axios.post(`${API_BASE_URL}/verify-otp/`, { email, otp });
  return response.data;
};
