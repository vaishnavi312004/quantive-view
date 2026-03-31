import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { TableSkeleton } from '@/components/ui/skeletons';
import { usersTableData } from '@/services/mockData';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const statusColors = {
  active: 'bg-success/10 text-success',
  idle: 'bg-warning/10 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

type SortKey = 'name' | 'email' | 'role' | 'lastActive' | 'status';

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let data = [...usersTableData];
    if (search) data = data.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all') data = data.filter(u => u.role === roleFilter);
    data.sort((a, b) => {
      const val = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === 'asc' ? val : -val;
    });
    return data;
  }, [search, sortKey, sortDir, roleFilter]);

  const stats = {
    total: usersTableData.length,
    active: usersTableData.filter(u => u.status === 'active').length,
    idle: usersTableData.filter(u => u.status === 'idle').length,
    inactive: usersTableData.filter(u => u.status === 'inactive').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor user activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total },
            { label: 'Active', value: stats.active },
            { label: 'Idle', value: stats.idle },
            { label: 'Inactive', value: stats.inactive },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-4 card-shadow">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? <TableSkeleton /> : (
          <div className="bg-card rounded-xl card-shadow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-border">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" aria-label="Search users" />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                aria-label="Filter by role"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="User">User</option>
              </select>
            </div>

            {/* Table */}
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
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No users found</td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.lastActive}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', statusColors[user.status])}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
