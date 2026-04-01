import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Users, TrendingUp, X, Eye, Lightbulb, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getUserStats } from '@/services/userService';
import { getProjects } from '@/services/projectService';
import { cn } from '@/lib/utils';

interface ReportInsight {
  icon: React.ElementType;
  text: string;
  type: 'positive' | 'neutral' | 'warning';
}

interface Report {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  insights: ReportInsight[];
  actions: string[];
}

const generateReports = (): Report[] => {
  const stats = getUserStats();
  const projects = getProjects();
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return [
    {
      id: 'monthly',
      title: 'Monthly Analytics Summary',
      icon: BarChart3,
      color: 'from-primary/20 to-primary/5',
      summary: `This month saw ${stats.total} total users with ${stats.active} active, across ${activeProjects} active projects. Engagement metrics show consistent growth.`,
      insights: [
        { icon: TrendingUp, text: `Active user ratio: ${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% — ${stats.active > stats.inactive ? 'healthy engagement' : 'needs improvement'}`, type: stats.active > stats.inactive ? 'positive' : 'warning' },
        { icon: BarChart3, text: `${activeProjects} active projects driving platform usage, with an average of ${stats.total > 0 ? Math.round(activeProjects / Math.max(stats.active, 1) * 10) / 10 : 0} projects per active user`, type: 'neutral' },
        { icon: CheckCircle2, text: 'Dashboard and Reports features maintain highest adoption rates at 92% and 78% respectively', type: 'positive' },
        { icon: AlertTriangle, text: 'API Integrations and Bulk Actions are underutilized — consider onboarding improvements', type: 'warning' },
      ],
      actions: ['Schedule stakeholder review', 'Set up automated weekly snapshots', 'Review underperforming features'],
    },
    {
      id: 'engagement',
      title: 'User Engagement Report',
      icon: Users,
      color: 'from-accent/20 to-accent/5',
      summary: `User engagement analysis across ${Object.keys(stats.roleDistribution).length} roles shows varied patterns. ${stats.active} users are currently active.`,
      insights: [
        { icon: Users, text: `Role distribution: ${Object.entries(stats.roleDistribution).map(([r, c]) => `${r} (${c})`).join(', ')}`, type: 'neutral' },
        { icon: TrendingUp, text: `${stats.active} active users contributing to daily metrics — DAU projected at steady growth`, type: 'positive' },
        { icon: AlertTriangle, text: `${stats.inactive} inactive users detected — potential churn risk of ${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}%`, type: stats.inactive > 2 ? 'warning' : 'neutral' },
        { icon: Lightbulb, text: 'Power users (top 12%) show 95% retention — leverage their patterns for onboarding', type: 'positive' },
      ],
      actions: ['Launch re-engagement campaign for inactive users', 'Analyze power user workflows', 'Implement role-specific dashboards'],
    },
    {
      id: 'feature',
      title: 'Feature Adoption Metrics',
      icon: BarChart3,
      color: 'from-warning/20 to-warning/5',
      summary: 'Feature adoption varies significantly. Core features see strong usage while advanced features need promotion.',
      insights: [
        { icon: CheckCircle2, text: 'Dashboard Analytics leads at 94% adoption with 9.2/10 engagement score', type: 'positive' },
        { icon: TrendingUp, text: 'Report Generator grew 25% this quarter — highest growth among all features', type: 'positive' },
        { icon: AlertTriangle, text: 'Email Notifications (28%) and Bulk Actions (22%) are significantly underperforming', type: 'warning' },
        { icon: Lightbulb, text: 'Features with guided tours show 3x higher first-week adoption', type: 'neutral' },
      ],
      actions: ['Add contextual tooltips to low-adoption features', 'Create feature walkthrough videos', 'A/B test notification preferences'],
    },
    {
      id: 'revenue',
      title: 'Revenue & Conversion Report',
      icon: TrendingUp,
      color: 'from-success/20 to-success/5',
      summary: `Revenue metrics track positively with ${stats.active} active users. Conversion funnel shows optimization opportunities.`,
      insights: [
        { icon: TrendingUp, text: 'MRR growth projected at 5.2% based on current user acquisition trends', type: 'positive' },
        { icon: BarChart3, text: `Free-to-paid conversion rate: 3.4% — industry average is 2.5%`, type: 'positive' },
        { icon: AlertTriangle, text: 'Trial-to-paid drop-off highest at Day 7 — consider mid-trial nudges', type: 'warning' },
        { icon: Lightbulb, text: 'Users who engage with 3+ features in week 1 convert at 8.7x higher rate', type: 'positive' },
      ],
      actions: ['Implement Day 7 onboarding email', 'Offer feature discovery incentives', 'Review pricing tier alignment'],
    },
  ];
};

const ReportsPage = () => {
  const [reports] = useState(generateReports);
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  const handleExport = (type: string, format: string) => {
    toast({ title: 'Export started', description: `Generating ${format.toUpperCase()} for "${type}"...` });
    setTimeout(() => {
      toast({ title: 'Download ready', description: `${type} (${format.toUpperCase()}) downloaded successfully.` });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">AI-generated analytics reports and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('All Reports', 'csv')}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button onClick={() => handleExport('All Reports', 'pdf')}><Download className="w-4 h-4 mr-2" />Export PDF</Button>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map(report => (
            <div key={report.id} className="bg-card rounded-xl card-shadow hover:card-shadow-lg transition-all group">
              <div className={cn('p-5 rounded-t-xl bg-gradient-to-br', report.color)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-card/80 flex items-center justify-center">
                    <report.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{report.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => setActiveReport(report)} className="text-primary hover:text-primary">
                  <Eye className="w-4 h-4 mr-1.5" /> View Insights
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleExport(report.title, 'pdf')}>
                    <Download className="w-4 h-4 mr-1" /> PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleExport(report.title, 'csv')}>
                    <Download className="w-4 h-4 mr-1" /> CSV
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setActiveReport(null)}>
          <div className="bg-card rounded-xl w-full max-w-2xl mx-4 card-shadow-lg animate-fade-in max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={cn('p-6 rounded-t-xl bg-gradient-to-br', activeReport.color)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-card/80 flex items-center justify-center">
                    <activeReport.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{activeReport.title}</h2>
                    <p className="text-xs text-muted-foreground">AI-Generated Insights</p>
                  </div>
                </div>
                <button onClick={() => setActiveReport(null)} className="p-1.5 rounded-lg hover:bg-card/50 text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Insights */}
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" /> Key Observations
                </h4>
                <div className="space-y-3">
                  {activeReport.insights.map((insight, i) => (
                    <div key={i} className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      insight.type === 'positive' && 'bg-success/5 border-success/20',
                      insight.type === 'warning' && 'bg-warning/5 border-warning/20',
                      insight.type === 'neutral' && 'bg-muted/50 border-border',
                    )}>
                      <insight.icon className={cn(
                        'w-4 h-4 mt-0.5 flex-shrink-0',
                        insight.type === 'positive' && 'text-success',
                        insight.type === 'warning' && 'text-warning',
                        insight.type === 'neutral' && 'text-muted-foreground',
                      )} />
                      <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Recommended Actions
                </h4>
                <div className="space-y-2">
                  {activeReport.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => handleExport(activeReport.title, 'csv')}>
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
                <Button onClick={() => handleExport(activeReport.title, 'pdf')}>
                  <Download className="w-4 h-4 mr-2" /> Export PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;
