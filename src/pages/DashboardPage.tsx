import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SparklineChart from '@/components/charts/SparklineChart';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeletons';
import { kpiData, dauOverTime, featureUsage, engagementTrends, generateSparkline } from '@/services/mockData';
import { getUserStats } from '@/services/userService';
import { getProjects } from '@/services/projectService';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['hsl(249,67%,64%)', 'hsl(160,82%,50%)', 'hsl(244,97%,80%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)'];

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(kpiData());
  const [dau, setDau] = useState(dauOverTime());
  const [features, setFeatures] = useState(featureUsage());
  const [engagement, setEngagement] = useState(engagementTrends());
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  // Dynamic user-aware data
  const buildUserDistribution = useCallback(() => {
    const stats = getUserStats();
    return Object.entries(stats.roleDistribution).map(([name, value], i) => ({
      name,
      value,
      fill: COLORS[i % COLORS.length],
    }));
  }, []);

  const buildDynamicKpis = useCallback(() => {
    const stats = getUserStats();
    const base = kpiData();
    // Adjust DAU/MAU based on active user count
    const activeRatio = stats.active / Math.max(stats.total, 1);
    const dauBase = 2000 + stats.active * 50;
    const mauBase = 15000 + stats.total * 200;
    const churnRate = stats.total > 0 ? ((stats.inactive / stats.total) * 5 + 1).toFixed(1) : '2.0';
    const retentionRate = (100 - parseFloat(churnRate) * 3).toFixed(1);

    base[0] = { ...base[0], value: dauBase.toLocaleString(), change: +(activeRatio * 8).toFixed(1), spark: generateSparkline(12, dauBase, dauBase * 0.1) };
    base[1] = { ...base[1], value: mauBase.toLocaleString(), change: +(3.1 + stats.total * 0.1).toFixed(1), spark: generateSparkline(12, mauBase, mauBase * 0.05) };
    base[2] = { ...base[2], value: churnRate + '%', change: -(0.3 + Math.random() * 0.2).toFixed(1) as unknown as number, spark: generateSparkline(12, parseFloat(churnRate), 1) };
    base[3] = { ...base[3], value: retentionRate + '%', change: +(1.2 + activeRatio).toFixed(1), spark: generateSparkline(12, parseFloat(retentionRate), 3) };
    return base;
  }, []);

  const [dist, setDist] = useState(buildUserDistribution);

  const refreshData = useCallback(() => {
    setKpis(buildDynamicKpis());
    setDau(dauOverTime());
    setFeatures(featureUsage());
    setDist(buildUserDistribution());
    setEngagement(engagementTrends());
  }, [buildDynamicKpis, buildUserDistribution]);

  useEffect(() => {
    const t = setTimeout(() => { refreshData(); setLoading(false); }, 1200);
    return () => clearTimeout(t);
  }, [refreshData]);

  useEffect(() => {
    const interval = setInterval(refreshData, 12000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time product analytics overview</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : kpis.map((kpi, i) => (
                <div key={i} className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-lg transition-shadow">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      <div className={cn('flex items-center gap-1 text-xs font-medium mt-1', Number(kpi.change) >= 0 ? 'text-success' : 'text-destructive')}>
                        {Number(kpi.change) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(Number(kpi.change))}%
                      </div>
                    </div>
                    <div className="w-24">
                      <SparklineChart data={kpi.spark} />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <div className="bg-card rounded-xl p-5 card-shadow">
                <h3 className="text-sm font-semibold text-foreground mb-4">Daily Active Users Over Time</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dau}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                    <Line type="monotone" dataKey="users" stroke="hsl(249,67%,64%)" strokeWidth={2.5} dot={{ r: 4 }}
                      activeDot={{ r: 6, onClick: (_: any, payload: any) => setSelectedChart(`DAU: ${payload?.payload?.month} - ${payload?.payload?.users} users`) }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-5 card-shadow">
                <h3 className="text-sm font-semibold text-foreground mb-4">Feature Usage</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={features} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="feature" type="category" width={100} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                    <Bar dataKey="usage" fill="hsl(160,82%,50%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-5 card-shadow">
                <h3 className="text-sm font-semibold text-foreground mb-4">User Distribution by Role</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={dist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {dist.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-5 card-shadow">
                <h3 className="text-sm font-semibold text-foreground mb-4">Engagement Trends</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={engagement}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(249,67%,64%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(249,67%,64%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160,82%,50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(160,82%,50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Area type="monotone" dataKey="sessions" stroke="hsl(249,67%,64%)" fillOpacity={1} fill="url(#colorSessions)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pageViews" stroke="hsl(160,82%,50%)" fillOpacity={1} fill="url(#colorPageViews)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {selectedChart && (
          <div className="bg-card rounded-xl p-5 card-shadow animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chart Detail</p>
                <p className="text-lg font-semibold text-foreground">{selectedChart}</p>
              </div>
              <button onClick={() => setSelectedChart(null)} className="text-sm text-primary hover:underline">Close</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
