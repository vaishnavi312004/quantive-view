export interface DynamicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
}

const USERS_KEY = 'dynamic_users';
const ROLES_KEY = 'custom_roles';

const DEFAULT_ROLES = ['Admin', 'Analyst', 'User'];

const seedUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const defaults: DynamicUser[] = [
      { id: 'du-1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', status: 'active', lastActive: '2 min ago', createdAt: '2025-10-01T10:00:00Z' },
      { id: 'du-2', name: 'Marcus Johnson', email: 'marcus@acme.com', role: 'User', status: 'active', lastActive: '15 min ago', createdAt: '2025-10-15T08:00:00Z' },
      { id: 'du-3', name: 'Elena Rodriguez', email: 'elena@acme.com', role: 'Analyst', status: 'active', lastActive: '1 hour ago', createdAt: '2025-11-01T09:00:00Z' },
      { id: 'du-4', name: 'David Kim', email: 'david@acme.com', role: 'User', status: 'active', lastActive: '3 hours ago', createdAt: '2025-11-20T14:00:00Z' },
      { id: 'du-5', name: 'Priya Patel', email: 'priya@acme.com', role: 'Admin', status: 'active', lastActive: '1 day ago', createdAt: '2025-12-01T11:00:00Z' },
      { id: 'du-6', name: 'Tom Wilson', email: 'tom@acme.com', role: 'User', status: 'inactive', lastActive: '5 days ago', createdAt: '2026-01-05T10:00:00Z' },
      { id: 'du-7', name: 'Lisa Chang', email: 'lisa@acme.com', role: 'Analyst', status: 'active', lastActive: '2 days ago', createdAt: '2026-01-15T08:00:00Z' },
      { id: 'du-8', name: 'James Brown', email: 'james@acme.com', role: 'User', status: 'inactive', lastActive: '1 week ago', createdAt: '2026-02-01T09:00:00Z' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  }
};
seedUsers();

export const getDynamicUsers = (): DynamicUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveDynamicUsers = (users: DynamicUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addDynamicUser = (user: Omit<DynamicUser, 'id' | 'createdAt'>): DynamicUser => {
  const users = getDynamicUsers();
  const newUser: DynamicUser = {
    ...user,
    id: 'du-' + crypto.randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveDynamicUsers(users);
  return newUser;
};

export const updateDynamicUser = (id: string, updates: Partial<DynamicUser>) => {
  const users = getDynamicUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    saveDynamicUsers(users);
  }
};

export const deleteDynamicUser = (id: string) => {
  saveDynamicUsers(getDynamicUsers().filter(u => u.id !== id));
};

// Custom roles
export const getCustomRoles = (): string[] => {
  const raw = localStorage.getItem(ROLES_KEY);
  if (!raw) return [...DEFAULT_ROLES];
  const stored: string[] = JSON.parse(raw);
  // Merge defaults
  const merged = [...new Set([...DEFAULT_ROLES, ...stored])];
  return merged;
};

export const addCustomRole = (role: string) => {
  const roles = getCustomRoles();
  if (!roles.includes(role)) {
    roles.push(role);
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  }
};

// Derived stats that react to dynamic users
export const getUserStats = () => {
  const users = getDynamicUsers();
  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const inactive = users.filter(u => u.status === 'inactive').length;
  const roleDistribution: Record<string, number> = {};
  users.forEach(u => {
    roleDistribution[u.role] = (roleDistribution[u.role] || 0) + 1;
  });
  return { total, active, inactive, roleDistribution };
};
