import { useState, useMemo, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getDynamicUsers, addDynamicUser, deleteDynamicUser, updateDynamicUser, getCustomRoles, addCustomRole, type DynamicUser } from '@/services/userService';
import { Search, ArrowUpDown, Plus, Trash2, Pencil, X, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { addAuditLog } from '@/services/auditService';

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-muted text-muted-foreground',
};

type SortKey = 'name' | 'email' | 'role' | 'lastActive' | 'status';

const UsersPage = () => {
  const [users, setUsers] = useState(getDynamicUsers());
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<DynamicUser | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'active' as 'active' | 'inactive' });
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showCustomRole, setShowCustomRole] = useState(false);

  const roles = getCustomRoles();
  const reload = useCallback(() => setUsers(getDynamicUsers()), []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let data = [...users];
    if (search) data = data.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter !== 'all') data = data.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') data = data.filter(u => u.status === statusFilter);
    data.sort((a, b) => {
      const val = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === 'asc' ? val : -val;
    });
    return data;
  }, [users, search, sortKey, sortDir, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    roles: [...new Set(users.map(u => u.role))].length,
  }), [users]);

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'User', status: 'active' });
    setShowCustomRole(false);
    setShowModal(true);
  };

  const openEdit = (u: DynamicUser) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, role: u.role, status: u.status });
    setShowCustomRole(false);
    setShowModal(true);
  };

  const handleAddCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (!trimmed) return;
    addCustomRole(trimmed);
    setFormData(prev => ({ ...prev, role: trimmed }));
    setCustomRoleInput('');
    setShowCustomRole(false);
    toast({ title: 'Role added', description: `"${trimmed}" is now available as a role` });
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast({ title: 'Error', description: 'Name is required', variant: 'destructive' }); return; }
    if (!formData.email.includes('@')) { toast({ title: 'Error', description: 'Valid email is required', variant: 'destructive' }); return; }
    if (!formData.role) { toast({ title: 'Error', description: 'Role is required', variant: 'destructive' }); return; }

    if (editingUser) {
      updateDynamicUser(editingUser.id, formData);
      addAuditLog('User Updated', `Updated user: ${formData.name}`);
      toast({ title: 'User updated', description: `${formData.name} has been updated` });
    } else {
      // Check duplicate email
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        toast({ title: 'Error', description: 'A user with this email already exists', variant: 'destructive' });
        return;
      }
      const timeAgo = ['Just now', '1 min ago', '5 min ago'][Math.floor(Math.random() * 3)];
      addDynamicUser({ ...formData, lastActive: timeAgo });
      addAuditLog('User Created', `Added new user: ${formData.name} (${formData.role})`);
      toast({ title: 'User created', description: `${formData.name} has been added as ${formData.role}` });
    }
    reload();
    setShowModal(false);
  };

  const handleDelete = (u: DynamicUser) => {
    deleteDynamicUser(u.id);
    addAuditLog('User Deleted', `Removed user: ${u.name}`);
    reload();
    toast({ title: 'User removed', description: `${u.name} has been deleted` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor user activity</p>
          </div>
          <Button onClick={openCreate}>
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total, color: 'text-primary' },
            { label: 'Active', value: stats.active, color: 'text-success' },
            { label: 'Inactive', value: stats.inactive, color: 'text-muted-foreground' },
            { label: 'Roles', value: stats.roles, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-4 card-shadow">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl card-shadow">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-border">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name, email, role..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" aria-label="Search users" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm" aria-label="Filter by role">
              <option value="all">All Roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm" aria-label="Filter by status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border">
                  {(['name', 'email', 'role', 'lastActive', 'status'] as SortKey[]).map(key => (
                    <th key={key} className="text-left px-4 py-3 text-muted-foreground font-medium">
                      <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-foreground transition-colors capitalize">
                        {key === 'lastActive' ? 'Last Active' : key}
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No users found</td></tr>
                ) : filtered.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', statusColors[user.status] || statusColors.inactive)}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Edit user"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(user)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete user"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 card-shadow-lg space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-lg">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Enter full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" disabled={!!editingUser} />
              </div>
              <div className="space-y-1.5">
                <Label>Role *</Label>
                <div className="flex gap-2">
                  <select
                    value={formData.role}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setShowCustomRole(true);
                      } else {
                        setFormData(p => ({ ...p, role: e.target.value }));
                        setShowCustomRole(false);
                      }
                    }}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    <option value="__custom__">+ Add Custom Role</option>
                  </select>
                </div>
                {showCustomRole && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={customRoleInput}
                      onChange={e => setCustomRoleInput(e.target.value)}
                      placeholder="e.g. HR, Manager, Intern..."
                      onKeyDown={e => e.key === 'Enter' && handleAddCustomRole()}
                    />
                    <Button size="sm" onClick={handleAddCustomRole}>Add</Button>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingUser ? 'Update' : 'Create User'}</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersPage;
