import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CardSkeleton } from '@/components/ui/skeletons';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);

  const handleExport = (type: string) => {
    toast({ title: 'Export started', description: `${type} report is being generated...` });
    setTimeout(() => {
      toast({ title: 'Export ready', description: `${type} report downloaded successfully.` });
    }, 1500);
  };

  const insights = [
    { icon: Users, title: 'User Growth', value: '+12.5%', detail: 'New signups increased by 12.5% compared to last month' },
    { icon: BarChart3, title: 'Feature Adoption', value: '78%', detail: 'Report Generator saw highest adoption this quarter' },
    { icon: FileText, title: 'Engagement Score', value: '8.2/10', detail: 'Overall platform engagement improved significantly' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Export analytics and view summary insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('CSV')}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button onClick={() => handleExport('PDF')}><Download className="w-4 h-4 mr-2" />Export PDF</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map(insight => (
              <div key={insight.title} className="bg-card rounded-xl p-5 card-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <insight.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className="text-xl font-bold text-foreground">{insight.value}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.detail}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="bg-card rounded-xl p-5 card-shadow">
            <h3 className="font-semibold text-foreground mb-4">Available Reports</h3>
            <div className="space-y-3">
              {['Monthly Analytics Summary', 'User Engagement Report', 'Feature Adoption Metrics', 'Revenue & Conversion Report'].map(report => (
                <div key={report} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{report}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleExport(report)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
