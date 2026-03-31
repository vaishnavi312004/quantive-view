import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addAuditLog } from '@/services/auditService';

export type UserRole = 'admin' | 'analyst';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CREDENTIALS: Record<string, { password: string; user: User }> = {
  'admin@company.com': {
    password: 'admin123',
    user: { email: 'admin@company.com', name: 'Alex Morgan', role: 'admin', avatar: 'AM' },
  },
  'analyst@company.com': {
    password: 'analyst123',
    user: { email: 'analyst@company.com', name: 'Jordan Lee', role: 'analyst', avatar: 'JL' },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    await new Promise(r => setTimeout(r, 800));
    const cred = CREDENTIALS[email.toLowerCase()];
    if (!cred || cred.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    setUser(cred.user);
    if (remember) {
      localStorage.setItem('auth_user', JSON.stringify(cred.user));
    } else {
      sessionStorage.setItem('auth_user', JSON.stringify(cred.user));
    }
    addAuditLog('Login', `${cred.user.name} logged in`);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    if (user) addAuditLog('Logout', `${user.name} logged out`);
    setUser(null);
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  }, [user]);

  useEffect(() => {
    if (!user) {
      const session = sessionStorage.getItem('auth_user');
      if (session) setUser(JSON.parse(session));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
