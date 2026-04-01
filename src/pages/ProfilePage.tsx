import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Name cannot be empty', variant: 'destructive' });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    updateProfile({ name, avatar: initials });
    setSaving(false);
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {user?.avatar}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Display Name</Label>
              <Input id="profile-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value={user?.email} disabled className="opacity-60" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user?.role} disabled className="opacity-60 capitalize" />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} disabled className="opacity-60" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
