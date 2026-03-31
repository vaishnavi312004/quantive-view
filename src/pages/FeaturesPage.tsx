import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CardSkeleton } from '@/components/ui/skeletons';
import { featureList } from '@/services/mockData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeaturesPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feature Usage</h1>
          <p className="text-sm text-muted-foreground">Track feature adoption and engagement</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureList.map(feature => (
              <div key={feature.name} className={cn('bg-card rounded-xl p-5 card-shadow hover:card-shadow-lg transition-shadow', feature.usage < 30 && 'border-l-4 border-destructive')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {trendIcon(feature.trend)}
                      <span className="text-sm text-muted-foreground">Engagement: {feature.engagement}/10</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{feature.usage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={cn('h-2.5 rounded-full transition-all', feature.usage >= 70 ? 'bg-success' : feature.usage >= 40 ? 'bg-warning' : 'bg-destructive')}
                    style={{ width: `${feature.usage}%` }}
                  />
                </div>
                {feature.usage < 30 && (
                  <p className="text-xs text-destructive mt-2 font-medium">⚠ Low adoption — consider improvements</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeaturesPage;
