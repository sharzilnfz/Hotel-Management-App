//AuthContext.tsx:
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  tier: 'standard' | 'silver' | 'gold' | 'platinum';
  profileImage?: string;
  language: 'en' | 'ar';
  role?: string;
  status?: string;
  isStaff?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  updateLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map backend user to frontend user format
const mapBackendUserToUser = (backendUser: {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  loyaltyPoints?: number;
  profileImage?: string;
  role?: string;
  status?: string;
  isStaff?: boolean;
}): User => {
  // Determine tier based on loyalty points
  let tier: 'standard' | 'silver' | 'gold' | 'platinum' = 'standard';
  const points = backendUser.loyaltyPoints || 0;
  if (points >= 1000) tier = 'platinum';
  else if (points >= 500) tier = 'gold';
  else if (points >= 200) tier = 'silver';

  return {
    id: backendUser._id,
    name: backendUser.fullName,
    email: backendUser.email,
    phone: backendUser.phone,
    loyaltyPoints: points,
    tier,
    profileImage: backendUser.profileImage || '',
    language: 'en', // Default language
    role: backendUser.role,
    status: backendUser.status,
    isStaff: backendUser.isStaff,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from local storage
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          // Validate token/session with the backend
          const isValidSession = await authService.validateToken();
          if (isValidSession) {
            // Get the fresh user data (validateToken updates localStorage)
            const freshUser = authService.getStoredUser();
            if (freshUser) {
              setUser(mapBackendUserToUser(freshUser));
            }
          } else {
            // Clear invalid session
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      const mappedUser = mapBackendUserToUser(response.user);
      setUser(mappedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    setIsLoading(true);

    try {
      const response = await authService.register(name, email, password, phone);
      const mappedUser = mapBackendUserToUser(response.user);
      setUser(mappedUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);

    try {
      const response = await authService.socialLogin(provider);
      const mappedUser = mapBackendUserToUser(response.user);
      setUser(mappedUser);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLanguage = (language: 'en' | 'ar') => {
    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem('parkside_user', JSON.stringify(updatedUser));
    }
  };

  const toggleLanguage = () => {
    if (user) {
      const newLanguage = user.language === 'en' ? 'ar' : 'en';
      updateLanguage(newLanguage);
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);

      // Update stored user data
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        const updatedStoredUser = { ...storedUser, ...updatedFields };
        localStorage.setItem(
          'parkside_user',
          JSON.stringify(updatedStoredUser)
        );
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        socialLogin,
        updateLanguage,
        toggleLanguage,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
