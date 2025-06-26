//authService.ts
import api from './api';

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  isStaff?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user: {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    phone?: string;
    loyaltyPoints: number;
    role: string;
    status: string;
    isStaff: boolean;
    registeredDate: string;
    lastLogin?: string;
  };
  token?: string;
  message?: string;
}

export interface ApiError {
  success: boolean;
  error: string;
  message?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users/login', {
        userName: email, // Backend expects userName which is the email
        password,
      });

      if (response.data.success && response.data.user) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }

        // Store user data
        localStorage.setItem(
          'parkside_user',
          JSON.stringify(response.data.user)
        );

        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        } else if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users/signup', {
        fullName: name,
        userName: email, // Using email as username
        email,
        password,
        phone: phone || '',
        role: 'Guest',
        isStaff: false,
      });

      if (response.data.success && response.data.user) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }

        // Store user data
        localStorage.setItem(
          'parkside_user',
          JSON.stringify(response.data.user)
        );

        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        } else if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const storedUser = this.getStoredUser();
      if (!storedUser) {
        return false;
      }

      // Use the backend's check endpoint to validate the user session
      const response = await api.post('/users/check', {
        user: storedUser,
      });

      if (response.data.success && response.data.user) {
        // Update stored user with fresh data from backend
        localStorage.setItem(
          'parkside_user',
          JSON.stringify(response.data.user)
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('parkside_user');
  }

  getStoredUser() {
    try {
      const storedUser = localStorage.getItem('parkside_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  async socialLogin(provider: 'google' | 'apple'): Promise<AuthResponse> {
    // This is a placeholder for social login implementation
    // You would integrate with actual OAuth providers here
    throw new Error(
      `${provider} login not implemented yet. Please use email/password login.`
    );
  }
}

export default new AuthService();
