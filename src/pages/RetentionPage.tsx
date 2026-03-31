import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/skeletons';
import { retentionCohorts } from '@/services/mockData';
import { cn } from '@/lib/utils';

const RetentionPage = () => {
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState(retentionCohorts());

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const cellColor = (val: number) => {
    if (val >= 70) return 'bg-success/20 text-success';
    if (val >= 50) return 'bg-success/10 text-foreground';
    if (val >= 30) return 'bg-warning/10 text-foreground';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Retention</h1>
          <p className="text-sm text-muted-foreground">Cohort retention analysis</p>
        </div>

        {/* Summary cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Day 1 Retention', value: Math.round(cohorts.reduce((s, c) => s + c.day1, 0) / cohorts.length) + '%' },
              { label: 'Day 7 Retention', value: Math.round(cohorts.reduce((s, c) => s + c.day7, 0) / cohorts.length) + '%' },
              { label: 'Day 30 Retention', value: Math.round(cohorts.reduce((s, c) => s + c.day30, 0) / cohorts.length) + '%' },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-5 card-shadow">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cohort Heatmap */}
        {loading ? <ChartSkeleton /> : (
          <div className="bg-card rounded-xl p-5 card-shadow overflow-x-auto">
            <h3 className="text-sm font-semibold text-foreground mb-4">Cohort Retention Heatmap</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Cohort</th>
                  <th className="px-3 py-2 text-muted-foreground font-medium">Users</th>
                  <th className="px-3 py-2 text-muted-foreground font-medium">Day 1</th>
                  <th className="px-3 py-2 text-muted-foreground font-medium">Day 7</th>
                  <th className="px-3 py-2 text-muted-foreground font-medium">Day 14</th>
                  <th className="px-3 py-2 text-muted-foreground font-medium">Day 30</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map(c => (
                  <tr key={c.cohort} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{c.cohort}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{c.users}</td>
                    {[c.day1, c.day7, c.day14, c.day30].map((val, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        <span className={cn('inline-block px-3 py-1 rounded-md text-xs font-semibold', cellColor(val))}>
                          {val}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetentionPage;
