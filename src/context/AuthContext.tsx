import React, { createContext, useContext, useState, useCallback } from 'react';
import { addAuditLog } from '@/services/auditService';

export type UserRole = 'admin' | 'analyst' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'avatar'>>) => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

interface StoredUser {
  user: User;
  password: string;
}

const USERS_KEY = 'app_users';
const SESSION_KEY = 'auth_user';

const getStoredUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Seed default users if none exist
const seedDefaults = () => {
  const existing = getStoredUsers();
  if (existing.length === 0) {
    const defaults: StoredUser[] = [
      { user: { id: '1', email: 'admin@company.com', name: 'Alex Morgan', role: 'admin', avatar: 'AM', createdAt: '2025-01-15T08:00:00Z' }, password: 'admin123' },
      { user: { id: '2', email: 'analyst@company.com', name: 'Jordan Lee', role: 'analyst', avatar: 'JL', createdAt: '2025-02-20T10:00:00Z' }, password: 'analyst123' },
    ];
    saveStoredUsers(defaults);
  }
};
seedDefaults();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    await new Promise(r => setTimeout(r, 600));
    const users = getStoredUsers();
    const found = users.find(u => u.user.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    setUser(found.user);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(found.user));
    addAuditLog('Login', `${found.user.name} logged in`);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    await new Promise(r => setTimeout(r, 600));
    const users = getStoredUsers();
    if (users.find(u => u.user.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      avatar: initials,
      createdAt: new Date().toISOString(),
    };
    users.push({ user: newUser, password });
    saveStoredUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    addAuditLog('Signup', `${newUser.name} created an account`);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    if (user) addAuditLog('Logout', `${user.name} logged out`);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, [user]);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'avatar'>>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Update in stored users
      const users = getStoredUsers();
      const idx = users.findIndex(u => u.user.id === prev.id);
      if (idx >= 0) {
        users[idx].user = { ...users[idx].user, ...updates };
        saveStoredUsers(users);
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      addAuditLog('Profile Update', `${updated.name} updated their profile`);
      return updated;
    });
  }, []);

  const getAllUsers = useCallback((): User[] => {
    return getStoredUsers().map(u => u.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
