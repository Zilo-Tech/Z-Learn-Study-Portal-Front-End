import axios from 'axios';

const API_BASE_URL = 'https://z-learn-study-portal-backend.onrender.com/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RegisterResponse {
  message: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with:', {
      email: credentials.email,
      password: credentials.password // Log actual password for debugging
    });
    console.log('API URL:', `${API_BASE_URL}/login-email/`);

    const response = await axios.post(`${API_BASE_URL}/login-email/`, {
      email: credentials.email.trim(),
      password: credentials.password
    });

    return response.data;
  } catch (error) {
    console.error('Login error details:', { error, isAxiosError: axios.isAxiosError(error) });
    
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      
      // Handle authentication errors
      if (error.response.status === 401) {
        if (typeof responseData === 'object' && 'detail' in responseData) {
          throw new Error(responseData.detail);
        }
        throw new Error('Invalid email or password');
      }
      
      // Handle validation errors
      if (error.response.status === 400) {
        if (typeof responseData === 'object') {
          const validationErrors: Record<string, string[]> = {};
          Object.entries(responseData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              validationErrors[field] = messages;
            } else if (typeof messages === 'string') {
              validationErrors[field] = [messages];
            }
          });
          throw new Error(JSON.stringify(validationErrors));
        }
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    
    // Handle network errors
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    
    throw new Error('Login failed. Please try again.');
  }
};

export const register = async (data: RegisterCredentials): Promise<RegisterResponse> => {
    try {
        console.log('Attempting registration with:', {
            full_name: data.full_name,
            email: data.email,
            password: '***',
            confirm_password: '***'
        });
        console.log('API URL:', `${API_BASE_URL}/register/`);

        const response = await axios.post(`${API_BASE_URL}/register/`, {
            full_name: data.full_name,
            email: data.email.trim(),
            password: data.password,
            confirm_password: data.confirm_password
        });

        return response.data;
    } catch (error) {
        console.error('Registration error details:', { error, isAxiosError: axios.isAxiosError(error) });
        
        if (axios.isAxiosError(error) && error.response) {
            const responseData = error.response.data;
            
            // Handle validation errors
            if (error.response.status === 400) {
                if (typeof responseData === 'object') {
                    // Create a validation error object
                    const validationErrors: Record<string, string[]> = {};
                    
                    // Process each field's errors
                    Object.entries(responseData).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            validationErrors[field] = messages;
                        } else if (typeof messages === 'string') {
                            validationErrors[field] = [messages];
                        }
                    });
                    
                    // Throw validation errors in a format the form can handle
                    throw new Error(JSON.stringify(validationErrors));
                }
            }
            
            // Handle other error cases
            if (error.response.status === 409) {
                throw new Error('This email is already registered');
            }
            
            // Handle server errors
            if (error.response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
        }
        
        // Handle network errors
        if (error instanceof Error) {
            if (error.message.includes('Network Error')) {
                throw new Error('Network error. Please check your connection.');
            }
        }
        
        throw new Error('Registration failed. Please try again.');
    }
}; 