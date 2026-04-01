export const generateSparkline = (points = 12, base = 50, variance = 20) =>
  Array.from({ length: points }, (_, i) => ({
    x: i,
    y: base + Math.round((Math.random() - 0.4) * variance),
  }));

export const kpiData = () => [
  { label: 'Daily Active Users', value: (2400 + Math.floor(Math.random() * 200)).toLocaleString(), change: +(5.2 + Math.random() * 2).toFixed(1), spark: generateSparkline(12, 2400, 300) },
  { label: 'Monthly Active Users', value: (18500 + Math.floor(Math.random() * 500)).toLocaleString(), change: +(3.1 + Math.random() * 1.5).toFixed(1), spark: generateSparkline(12, 18500, 1000) },
  { label: 'Churn Rate', value: (2.1 + Math.random() * 0.5).toFixed(1) + '%', change: -(0.3 + Math.random() * 0.2).toFixed(1) as unknown as number, spark: generateSparkline(12, 3, 1) },
  { label: 'Retention Rate', value: (87 + Math.random() * 3).toFixed(1) + '%', change: +(1.2 + Math.random()).toFixed(1), spark: generateSparkline(12, 87, 5) },
  { label: 'Avg Session Time', value: Math.floor(4 + Math.random() * 2) + 'm ' + Math.floor(Math.random() * 60) + 's', change: +(2.8 + Math.random()).toFixed(1), spark: generateSparkline(12, 5, 2) },
  { label: 'Conversion Rate', value: (3.2 + Math.random()).toFixed(1) + '%', change: +(0.5 + Math.random() * 0.5).toFixed(1), spark: generateSparkline(12, 3, 1) },
];

export const dauOverTime = () =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
    month,
    users: 1800 + Math.floor(Math.random() * 1200),
  }));

export const featureUsage = () => [
  { feature: 'Dashboard', usage: 92 + Math.floor(Math.random() * 8) },
  { feature: 'Reports', usage: 75 + Math.floor(Math.random() * 15) },
  { feature: 'Analytics', usage: 68 + Math.floor(Math.random() * 20) },
  { feature: 'Settings', usage: 45 + Math.floor(Math.random() * 15) },
  { feature: 'Export', usage: 35 + Math.floor(Math.random() * 20) },
  { feature: 'Integrations', usage: 28 + Math.floor(Math.random() * 15) },
];

export const userDistribution = () => [
  { name: 'Free', value: 4200 + Math.floor(Math.random() * 300), fill: 'hsl(var(--chart-1))' },
  { name: 'Pro', value: 2800 + Math.floor(Math.random() * 200), fill: 'hsl(var(--chart-2))' },
  { name: 'Enterprise', value: 1200 + Math.floor(Math.random() * 100), fill: 'hsl(var(--chart-3))' },
];

export const engagementTrends = () =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
    month,
    sessions: 3000 + Math.floor(Math.random() * 2000),
    pageViews: 8000 + Math.floor(Math.random() * 4000),
  }));

export const usersTableData = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', lastActive: '2 min ago', status: 'active' as const },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@acme.com', role: 'User', lastActive: '15 min ago', status: 'active' as const },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@acme.com', role: 'Analyst', lastActive: '1 hour ago', status: 'active' as const },
  { id: '4', name: 'David Kim', email: 'david@acme.com', role: 'User', lastActive: '3 hours ago', status: 'idle' as const },
  { id: '5', name: 'Priya Patel', email: 'priya@acme.com', role: 'Admin', lastActive: '1 day ago', status: 'idle' as const },
  { id: '6', name: 'Tom Wilson', email: 'tom@acme.com', role: 'User', lastActive: '5 days ago', status: 'inactive' as const },
  { id: '7', name: 'Lisa Chang', email: 'lisa@acme.com', role: 'Analyst', lastActive: '2 days ago', status: 'active' as const },
  { id: '8', name: 'James Brown', email: 'james@acme.com', role: 'User', lastActive: '1 week ago', status: 'inactive' as const },
];

export const featureList = [
  { name: 'Dashboard Analytics', usage: 94, engagement: 9.2, trend: 'up' as const },
  { name: 'Report Generator', usage: 78, engagement: 8.1, trend: 'up' as const },
  { name: 'User Management', usage: 65, engagement: 7.5, trend: 'stable' as const },
  { name: 'Data Export', usage: 52, engagement: 6.8, trend: 'down' as const },
  { name: 'Custom Filters', usage: 48, engagement: 6.2, trend: 'up' as const },
  { name: 'API Integrations', usage: 34, engagement: 5.5, trend: 'stable' as const },
  { name: 'Email Notifications', usage: 28, engagement: 4.8, trend: 'down' as const },
  { name: 'Bulk Actions', usage: 22, engagement: 4.1, trend: 'down' as const },
];

export const retentionCohorts = () => {
  const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  return months.map(month => ({
    cohort: month,
    users: 500 + Math.floor(Math.random() * 300),
    day1: 75 + Math.floor(Math.random() * 15),
    day7: 55 + Math.floor(Math.random() * 15),
    day14: 40 + Math.floor(Math.random() * 15),
    day30: 28 + Math.floor(Math.random() * 15),
  }));
};

export const notifications = [
  { id: '1', title: 'New user signup', detail: 'sarah@newco.com just signed up', time: '2 min ago', read: false },
  { id: '2', title: 'Revenue increased', detail: 'MRR up 12% this month', time: '1 hour ago', read: false },
  { id: '3', title: 'Feature spike', detail: 'Report Generator usage up 25%', time: '3 hours ago', read: false },
  { id: '4', title: 'Churn alert', detail: '3 enterprise users at risk', time: '5 hours ago', read: true },
  { id: '5', title: 'Weekly digest ready', detail: 'Your analytics summary is available', time: '1 day ago', read: true },
];

export const searchableItems = [
  { type: 'user' as const, label: 'Sarah Chen', sublabel: 'sarah@acme.com' },
  { type: 'user' as const, label: 'Marcus Johnson', sublabel: 'marcus@acme.com' },
  { type: 'user' as const, label: 'Elena Rodriguez', sublabel: 'elena@acme.com' },
  { type: 'feature' as const, label: 'Dashboard Analytics', sublabel: '94% usage' },
  { type: 'feature' as const, label: 'Report Generator', sublabel: '78% usage' },
  { type: 'feature' as const, label: 'User Management', sublabel: '65% usage' },
  { type: 'page' as const, label: 'Dashboard', sublabel: '/dashboard' },
  { type: 'page' as const, label: 'Projects', sublabel: '/projects' },
  { type: 'page' as const, label: 'Users', sublabel: '/users' },
  { type: 'page' as const, label: 'Features', sublabel: '/features' },
  { type: 'page' as const, label: 'Retention', sublabel: '/retention' },
  { type: 'page' as const, label: 'Reports', sublabel: '/reports' },
  { type: 'page' as const, label: 'AI Assistant', sublabel: '/ai-assistant' },
  { type: 'page' as const, label: 'Profile', sublabel: '/profile' },
  { type: 'page' as const, label: 'Settings', sublabel: '/settings' },
];
