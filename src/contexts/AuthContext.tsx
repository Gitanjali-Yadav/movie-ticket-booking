import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USERS_KEY = 'mock_users';
const CURRENT_USER_KEY = 'mock_current_user';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    setUser({ email: found.email, displayName: found.displayName });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: found.email, displayName: found.displayName }));
  };

  const register = async (email: string, password: string) => {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === email)) throw new Error('User already exists');
    const newUser = { email, password, displayName: email.split('@')[0] };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser({ email: newUser.email, displayName: newUser.displayName });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: newUser.email, displayName: newUser.displayName }));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 