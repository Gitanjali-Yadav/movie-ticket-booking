import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * User interface defining the structure of a user object
 */
interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * AuthContext interface defining the shape of the authentication context
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// Create the authentication context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages user state, login, registration, and logout functionality.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for user authentication and loading status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Login function to authenticate users
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication logic
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Register function to create new user accounts
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} name - User's name
   */
  const register = async (email: string, password: string, name: string) => {
    try {
      // TODO: Implement actual registration logic
      const mockUser: User = {
        id: '1',
        email,
        name,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Logout function to clear user session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Context value containing all authentication-related functions and state
  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the authentication context
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 