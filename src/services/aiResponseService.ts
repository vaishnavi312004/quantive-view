import { kpiData } from '@/services/mockData';
import { getProjects } from '@/services/projectService';
import { getUserStats } from '@/services/userService';
import {
  TrendingUp, TrendingDown, AlertTriangle, Users, Lightbulb,
  BarChart3, CheckCircle2, ArrowRight, Target, Zap,
} from 'lucide-react';
import type { AISectionBlock } from '@/components/ai/AIMessageContent';

interface AIContext {
  userName: string;
  userRole: string;
  userEmail: string;
}

export const generateAIResponse = (query: string, ctx: AIContext): AISectionBlock[] => {
  const kpis = kpiData();
  const projects = getProjects();
  const stats = getUserStats();
  const q = query.toLowerCase();

  const roleNote = `Based on your current role as ${ctx.userRole}`;

  // Natural language question handling
  if (q.includes('why') || q.includes('how come') || q.includes('what happened') || q.includes('going down') || q.includes('dropping')) {
    return [
      {
        heading: '📉 What\'s Happening',
        icon: TrendingDown,
        items: [
          { icon: TrendingDown, title: 'Metric Trend', value: kpis[2].value, description: `Churn rate is ${Number(kpis[2].change) > 0 ? 'rising' : 'declining'} (${kpis[2].change}%). ${roleNote}, this may impact your team's KPIs.`, type: Number(kpis[2].change) > 0 ? 'warning' : 'positive' },
          { icon: BarChart3, title: 'Conversion Rate', value: kpis[5].value, description: `Currently at ${kpis[5].value} with ${kpis[5].change}% change — ${Number(kpis[5].change) < 0 ? 'showing friction in the funnel' : 'holding steady'}`, type: Number(kpis[5].change) < 0 ? 'warning' : 'info' },
        ],
      },
      {
        heading: '🔎 Likely Reasons',
        icon: AlertTriangle,
        items: [
          { icon: AlertTriangle, title: 'Engagement Drop', description: 'Users in casual and at-risk segments have reduced session frequency over the past week', type: 'warning' },
          { icon: Users, title: 'Role Distribution Shift', description: `${Object.keys(stats.roleDistribution).length} active roles detected — newer roles may have lower feature adoption`, type: 'neutral' },
          { icon: Target, title: 'Feature Friction', description: 'Low-adoption features may be creating confusion for new user segments', type: 'info' },
        ],
      },
      {
        heading: '✅ Suggested Actions',
        icon: CheckCircle2,
        items: [
          { icon: ArrowRight, title: 'Run Onboarding Audit', description: 'Review the onboarding flow for newly added roles to reduce early drop-off', type: 'info' },
          { icon: ArrowRight, title: 'Targeted Outreach', description: 'Reach out to at-risk users with personalized re-engagement campaigns', type: 'info' },
          { icon: ArrowRight, title: 'Feature Simplification', description: 'Identify and simplify low-performing features to reduce user friction', type: 'neutral' },
        ],
      },
    ];
  }

  if (q.includes('insight') || q.includes('dashboard') || q.includes('metric')) {
    return [
      {
        heading: '📊 Dashboard Insights',
        icon: BarChart3,
        items: [
          { icon: Users, title: `👤 ${ctx.userName}`, description: `Current role: ${ctx.userRole} · ${roleNote}, here\'s your personalized overview`, type: 'info' },
          { icon: TrendingUp, title: 'Daily Active Users', value: kpis[0].value, description: `${Number(kpis[0].change) >= 0 ? '↑' : '↓'} ${Math.abs(Number(kpis[0].change))}% from last period — driven mainly by analyst and manager roles`, type: Number(kpis[0].change) >= 0 ? 'positive' : 'warning' },
          { icon: Target, title: 'Churn Rate', value: kpis[2].value, description: Number(kpis[2].change) < 0 ? 'Improving — down from last month' : 'Needs attention — trending upward', type: Number(kpis[2].change) < 0 ? 'positive' : 'warning' },
          { icon: Users, title: 'Active Users', value: `${stats.active} of ${stats.total}`, description: `${Math.round((stats.active / Math.max(stats.total, 1)) * 100)}% activity rate across ${Object.keys(stats.roleDistribution).length} roles`, type: 'info' },
          { icon: BarChart3, title: 'Active Projects', value: String(projects.filter(p => p.status === 'active').length), description: `${projects.length} total projects tracked`, type: 'neutral' },
        ],
      },
      {
        heading: '💡 Recommended Actions',
        icon: Lightbulb,
        items: [
          { icon: ArrowRight, title: 'Retention Focus', description: 'Focus retention efforts on the Day 7–14 window where most drop-off occurs', type: 'info' },
          { icon: ArrowRight, title: 'Feature Review', description: 'Investigate low adoption features and consider guided tours', type: 'neutral' },
          { icon: ArrowRight, title: 'Team Sync', description: 'Schedule a deep-dive review with the analytics team', type: 'neutral' },
        ],
      },
    ];
  }

  if (q.includes('anomal')) {
    return [
      {
        heading: '⚠️ Detected Anomalies',
        icon: AlertTriangle,
        items: [
          { icon: Zap, title: 'Session Time Spike', value: '+35%', description: 'Avg session time increased 35% in the last 48 hours — possibly linked to new feature launch', type: 'warning' },
          { icon: TrendingDown, title: 'Enterprise Churn Cluster', value: '8 users', description: '8 enterprise users showed disengagement signals this week', type: 'warning' },
          { icon: AlertTriangle, title: 'API Traffic Pattern', description: 'Unusual traffic from API integrations detected on Tuesday — monitor for suspicious patterns', type: 'warning' },
        ],
      },
      {
        heading: '✅ Suggested Actions',
        icon: CheckCircle2,
        items: [
          { icon: ArrowRight, title: 'Review Feature Rollout', description: 'Analyze the impact of the latest feature release on session metrics', type: 'info' },
          { icon: ArrowRight, title: 'Account Outreach', description: 'Reach out to the 8 at-risk enterprise accounts with personalized support', type: 'info' },
          { icon: ArrowRight, title: 'API Monitoring', description: 'Set up alerts for unusual API usage patterns', type: 'neutral' },
        ],
      },
    ];
  }

  if (q.includes('segment') || q.includes('user')) {
    return [
      {
        heading: '👥 User Segments',
        icon: Users,
        items: [
          { icon: TrendingUp, title: 'Power Users', value: '12%', description: '95% retention, 9.4/10 engagement — your most loyal cohort', type: 'positive' },
          { icon: Users, title: 'Regular Users', value: '45%', description: '78% retention, 7.2/10 engagement — stable and growing', type: 'positive' },
          { icon: Target, title: 'Casual Users', value: '30%', description: '52% retention, 4.8/10 engagement — opportunity for activation', type: 'neutral' },
          { icon: AlertTriangle, title: 'At Risk', value: '13%', description: '28% retention, 2.1/10 engagement — grew 3% this month', type: 'warning' },
        ],
      },
      {
        heading: '📊 Role Distribution',
        icon: BarChart3,
        items: Object.entries(stats.roleDistribution).map(([role, count]) => ({
          icon: Users,
          title: role,
          value: String(count),
          description: `${Math.round((count / Math.max(stats.total, 1)) * 100)}% of total users`,
          type: 'info' as const,
        })),
      },
    ];
  }

  if (q.includes('recommend') || q.includes('improve') || q.includes('suggest')) {
    return [
      {
        heading: '💡 Smart Recommendations',
        icon: Lightbulb,
        items: [
          { icon: Zap, title: 'Onboarding Optimization', description: `40% of new users drop off at step 3. ${roleNote}, consider simplifying the setup wizard.`, type: 'warning' },
          { icon: Target, title: 'Feature Discovery', description: 'Only 28% of users have tried Integrations. Add contextual tooltips and in-app guides.', type: 'neutral' },
          { icon: TrendingUp, title: 'Notification Tuning', description: 'Weekly digest open rate is 62%. Test bi-weekly cadence for better engagement.', type: 'info' },
          { icon: Users, title: 'Mobile Experience', description: 'Mobile sessions are 3x shorter. Prioritize responsive UX improvements.', type: 'warning' },
          { icon: CheckCircle2, title: 'Project Templates', description: 'Users who use templates have 2x higher retention. Promote them during onboarding.', type: 'positive' },
        ],
      },
    ];
  }

  if (q.includes('predict') || q.includes('forecast') || q.includes('trend')) {
    return [
      {
        heading: '🔮 30-Day Forecast',
        icon: TrendingUp,
        items: [
          { icon: TrendingUp, title: 'DAU Projection', value: '2,800–3,100', description: 'Expected 8-12% growth based on current trajectory and recent role additions', type: 'positive' },
          { icon: Target, title: 'Churn Forecast', value: '~1.8%', description: 'Likely to decrease if current retention initiatives hold — cautious optimism', type: 'positive' },
          { icon: BarChart3, title: 'Revenue Impact', value: '+5.2%', description: 'Projected MRR growth based on conversion trends and user expansion', type: 'positive' },
          { icon: Users, title: 'User Growth', value: `+${Math.max(2, Math.round(stats.total * 0.12))}`, description: `Estimated new users in next 30 days based on current signup velocity`, type: 'info' },
        ],
      },
      {
        heading: '📊 Confidence & Factors',
        icon: CheckCircle2,
        items: [
          { icon: CheckCircle2, title: 'Prediction Confidence', value: '82%', description: 'Based on 90-day rolling averages — actual results may vary with market conditions', type: 'info' },
          { icon: Lightbulb, title: 'Key Influencing Factors', description: `Role distribution (${Object.keys(stats.roleDistribution).length} roles), ${projects.filter(p => p.status === 'active').length} active projects, and seasonal patterns`, type: 'neutral' },
        ],
      },
    ];
  }

  return [
    {
      heading: '📊 Analysis Summary',
      icon: BarChart3,
      items: [
        { icon: Users, title: `👤 ${ctx.userName} (${ctx.userRole})`, description: `${roleNote}, here\'s a quick overview of your platform`, type: 'info' },
        { icon: Users, title: 'Total Users', value: String(stats.total), description: `${stats.active} active, ${stats.inactive} inactive`, type: 'info' },
        { icon: BarChart3, title: 'Projects', value: String(projects.length), description: `${projects.filter(p => p.status === 'active').length} active projects`, type: 'neutral' },
        { icon: TrendingUp, title: 'DAU', value: kpis[0].value, description: 'Current daily active users', type: 'positive' },
      ],
    },
    {
      heading: '🧠 What I Can Help With',
      icon: Lightbulb,
      items: [
        { icon: ArrowRight, title: 'Dashboard Insights', description: 'Analyze metrics and KPIs with role-aware context', type: 'info' },
        { icon: ArrowRight, title: 'Anomaly Detection', description: 'Find data irregularities and spikes', type: 'info' },
        { icon: ArrowRight, title: 'Predictions', description: 'Forecast trends and growth with confidence levels', type: 'info' },
        { icon: ArrowRight, title: 'Recommendations', description: 'Get actionable improvement suggestions', type: 'info' },
      ],
    },
  ];
};
