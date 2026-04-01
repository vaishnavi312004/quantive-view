import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Bell, Search, LogOut, Moon, Sun, ChevronRight, Menu, X, User, LayoutDashboard, Users, Puzzle, RotateCcw, FileText, Settings, FolderKanban, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notifications as mockNotifications, searchableItems } from '@/services/mockData';
import { cn } from '@/lib/utils';

const mobileMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Features', icon: Puzzle, path: '/features' },
  { label: 'Retention', icon: RotateCcw, path: '/retention' },
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings', adminOnly: true },
];

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifs, setNotifs] = useState(mockNotifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 0
    ? searchableItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sublabel.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbs = location.pathname.split('/').filter(Boolean);
  const filtered = mobileMenuItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <>
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-muted-foreground" aria-label="Menu">
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <span>Home</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium capitalize' : 'capitalize'}>{crumb.replace('-', ' ')}</span>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div ref={searchRef} className="relative">
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              {showSearch && (
                <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl card-shadow-lg p-2 animate-fade-in">
                  <input autoFocus type="text" placeholder="Search users, features, projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none" aria-label="Global search" />
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {searchResults.map((item, i) => (
                        <button key={i} onClick={() => { if (item.type === 'page') navigate(item.sublabel); setShowSearch(false); setSearchQuery(''); }} className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-muted text-left text-sm transition-colors">
                          <span className="text-foreground">{item.label}</span>
                          <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div ref={notifRef} className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors relative" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl card-shadow-lg animate-fade-in">
                  <div className="px-4 py-3 border-b border-border font-semibold text-sm text-foreground">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifs.map(n => (
                      <button key={n.id} onClick={() => markAsRead(n.id)} className={cn('w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0', !n.read && 'bg-primary/5')}>
                        <div className="flex items-start gap-2">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                          <div className={n.read ? 'ml-4' : ''}>
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.detail}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="User menu">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user?.avatar}
                </div>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl card-shadow-lg animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">{user?.role}</span>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm">
          <nav className="p-4 space-y-1">
            {filtered.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setShowMobileMenu(false)} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default TopNavbar;
