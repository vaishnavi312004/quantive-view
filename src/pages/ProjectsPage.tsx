import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getProjects, addProject, updateProject, deleteProject, Project } from '@/services/projectService';
import { getDynamicUsers } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, FolderKanban, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProjectsPage = () => {
  const { user, getAllUsers } = useAuth();
  const [projects, setProjects] = useState(getProjects());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' as 'active' | 'inactive', assignedUsers: [] as string[] });

  const allUsers = getDynamicUsers();

  const filtered = useMemo(() => {
    let data = projects;
    if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') data = data.filter(p => p.status === statusFilter);
    // Non-admin users only see their assigned projects
    if (user?.role === 'user') data = data.filter(p => p.assignedUsers.includes(user.id));
    return data;
  }, [projects, search, statusFilter, user]);

  const reload = () => setProjects(getProjects());

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', status: 'active', assignedUsers: [] });
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setFormData({ name: p.name, description: p.description, status: p.status, assignedUsers: p.assignedUsers });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast({ title: 'Error', description: 'Project name is required', variant: 'destructive' }); return; }
    if (editingId) {
      updateProject(editingId, formData);
      toast({ title: 'Project updated' });
    } else {
      addProject({ ...formData, createdBy: user?.id || '' });
      toast({ title: 'Project created' });
    }
    reload();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    reload();
    toast({ title: 'Project deleted' });
  };

  const toggleUserAssignment = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(u => u !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const getUserName = (id: string) => allUsers.find(u => u.id === id)?.name || 'Unknown';
  const getUserAvatar = (id: string) => {
    const u = allUsers.find(x => x.id === id);
    return u ? u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-sm text-muted-foreground">Manage and track all projects</p>
          </div>
          {user?.role !== 'user' && (
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> New Project</Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Project Grid */}
        {filtered.length === 0 ? (
          <div className="bg-card rounded-xl p-12 card-shadow text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(project => (
              <div key={project.id} className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-lg transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{project.name}</h3>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase', project.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  {user?.role !== 'user' && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>By {getUserName(project.createdBy)}</span>
                  <span>{project.assignedUsers.length} member{project.assignedUsers.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex -space-x-2 mt-2">
                  {project.assignedUsers.slice(0, 4).map(uid => {
                    const u = allUsers.find(x => x.id === uid);
                    return (
                      <div key={uid} className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card" title={getUserName(uid)}>
                        {getUserAvatar(uid)}
                      </div>
                    );
                  })}
                  {project.assignedUsers.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card">
                      +{project.assignedUsers.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 card-shadow-lg space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-lg">{editingId ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Project Name</Label>
                  <Input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter project name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none"
                    placeholder="Describe the project..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Users</Label>
                  <div className="flex flex-wrap gap-2">
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => toggleUserAssignment(u.id)}
                        className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors', formData.assignedUsers.includes(u.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary')}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
