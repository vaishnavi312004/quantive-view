import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { getAuditLog } from '@/services/auditService';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const auditLog = getAuditLog();

  const handleSave = () => {
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <h3 className="font-semibold text-foreground">Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {user?.avatar}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">{user?.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email} disabled />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <h3 className="font-semibold text-foreground">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {[
            { label: 'Email Notifications', desc: 'Receive alerts via email', checked: emailNotifs, onChange: setEmailNotifs },
            { label: 'Push Notifications', desc: 'Browser push notifications', checked: pushNotifs, onChange: setPushNotifs },
            { label: 'Weekly Digest', desc: 'Weekly summary of analytics', checked: weeklyDigest, onChange: setWeeklyDigest },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={item.checked} onCheckedChange={item.onChange} aria-label={item.label} />
            </div>
          ))}
        </div>

        <Button onClick={handleSave}>Save Changes</Button>

        {/* Audit Log */}
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <h3 className="font-semibold text-foreground">Activity Log</h3>
          {auditLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditLog.slice(0, 20).map(entry => (
                <div key={entry.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground"><span className="font-medium">{entry.action}:</span> {entry.detail}</p>
                    <p className="text-xs text-muted-foreground">{entry.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
