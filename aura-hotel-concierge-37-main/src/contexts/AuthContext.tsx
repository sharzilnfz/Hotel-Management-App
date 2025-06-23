//AuthContext.tsx:
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  tier: 'standard' | 'silver' | 'gold' | 'platinum';
  profileImage?: string;
  language: 'en' | 'ar';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  updateLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  loyaltyPoints: 750,
  tier: 'gold',
  profileImage:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop&crop=faces&q=80',
  language: 'en',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem('parkside_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, we would validate credentials against a backend
      // For now, just check if email contains "@" and password is not empty
      if (!email.includes('@') || !password) {
        throw new Error('Invalid credentials');
      }

      // Set user state with mock data
      setUser(mockUser);
      localStorage.setItem('parkside_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parkside_user');
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate inputs
      if (!name || !email.includes('@') || !password) {
        throw new Error('Invalid registration details');
      }

      // Create new user based on mock but with provided details
      const newUser: User = {
        ...mockUser,
        id: `user-${Date.now()}`,
        name,
        email,
        loyaltyPoints: 0,
        tier: 'standard',
      };

      setUser(newUser);
      localStorage.setItem('parkside_user', JSON.stringify(newUser));
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, we would handle OAuth flow
      // For now, just set user state with mock data
      setUser(mockUser);
      localStorage.setItem('parkside_user', JSON.stringify(mockUser));
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
      localStorage.setItem('parkside_user', JSON.stringify(updatedUser));
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
        updateUser, // Add the new function
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
