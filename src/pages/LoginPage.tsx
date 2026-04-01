import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Activity, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e: typeof errors = {};
    if (!email.includes('@')) e.email = 'Please enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password, remember);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="relative z-10 text-center px-12 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground">Product Analytics</h1>
          <p className="text-primary-foreground/80 text-lg max-w-md mx-auto">
            Enterprise-grade insights for product teams. Track usage, retention, and growth metrics in real time.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Analytics</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }} aria-invalid={!!errors.email} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }} aria-invalid={!!errors.password} className={errors.password ? 'border-destructive' : ''} />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={v => setRemember(!!v)} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
          </p>

          <div className="text-center">
            <p className="text-xs text-muted-foreground space-y-1">
              <span className="block">Demo: admin@company.com / admin123</span>
              <span className="block">Demo: analyst@company.com / analyst123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
