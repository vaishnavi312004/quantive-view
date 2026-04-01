import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/services/projectService';
import { getUserStats } from '@/services/userService';
import { kpiData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, TrendingUp, TrendingDown, AlertTriangle, Users, Lightbulb, BarChart3, CheckCircle2, ArrowRight, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCard {
  icon: React.ElementType;
  title: string;
  value?: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral' | 'info';
}

interface AISectionBlock {
  heading: string;
  icon: React.ElementType;
  items: InsightCard[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  sections?: AISectionBlock[];
  timestamp: Date;
}

const quickActions = [
  { label: 'Dashboard Insights', icon: TrendingUp, query: 'Give me insights on current dashboard metrics' },
  { label: 'Anomaly Detection', icon: AlertTriangle, query: 'Detect any anomalies in the recent data' },
  { label: 'User Segments', icon: Users, query: 'Analyze user segments and their behavior' },
  { label: 'Recommendations', icon: Lightbulb, query: 'Suggest improvements for product engagement' },
];

const generateAIResponse = (query: string, userName: string): AISectionBlock[] => {
  const kpis = kpiData();
  const projects = getProjects();
  const stats = getUserStats();
  const q = query.toLowerCase();

  if (q.includes('insight') || q.includes('dashboard') || q.includes('metric')) {
    return [
      {
        heading: 'Metrics Overview',
        icon: BarChart3,
        items: [
          { icon: TrendingUp, title: 'Daily Active Users', value: kpis[0].value, description: `${Number(kpis[0].change) >= 0 ? '↑' : '↓'} ${Math.abs(Number(kpis[0].change))}% from last period`, type: Number(kpis[0].change) >= 0 ? 'positive' : 'warning' },
          { icon: Target, title: 'Churn Rate', value: kpis[2].value, description: Number(kpis[2].change) < 0 ? 'Improving — down from last month' : 'Needs attention — trending up', type: Number(kpis[2].change) < 0 ? 'positive' : 'warning' },
          { icon: Users, title: 'Active Users', value: `${stats.active} of ${stats.total}`, description: `${Math.round((stats.active / Math.max(stats.total, 1)) * 100)}% activity rate across ${Object.keys(stats.roleDistribution).length} roles`, type: 'info' },
          { icon: BarChart3, title: 'Active Projects', value: String(projects.filter(p => p.status === 'active').length), description: `${projects.length} total projects tracked`, type: 'neutral' },
        ],
      },
      {
        heading: 'Recommended Actions',
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
        heading: 'Detected Anomalies',
        icon: AlertTriangle,
        items: [
          { icon: Zap, title: 'Session Time Spike', value: '+35%', description: 'Avg session time increased 35% in the last 48 hours — possibly linked to new feature launch', type: 'warning' },
          { icon: TrendingDown, title: 'Enterprise Churn Cluster', value: '8 users', description: '8 enterprise users showed disengagement signals this week', type: 'warning' },
          { icon: AlertTriangle, title: 'API Traffic Pattern', description: 'Unusual traffic from API integrations detected on Tuesday — monitor for suspicious patterns', type: 'warning' },
        ],
      },
      {
        heading: 'Suggested Actions',
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
        heading: 'User Segments',
        icon: Users,
        items: [
          { icon: TrendingUp, title: 'Power Users', value: '12%', description: '95% retention, 9.4/10 engagement — your most loyal cohort', type: 'positive' },
          { icon: Users, title: 'Regular Users', value: '45%', description: '78% retention, 7.2/10 engagement — stable and growing', type: 'positive' },
          { icon: Target, title: 'Casual Users', value: '30%', description: '52% retention, 4.8/10 engagement — opportunity for activation', type: 'neutral' },
          { icon: AlertTriangle, title: 'At Risk', value: '13%', description: '28% retention, 2.1/10 engagement — grew 3% this month', type: 'warning' },
        ],
      },
      {
        heading: 'Role Distribution',
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
        heading: 'Smart Recommendations',
        icon: Lightbulb,
        items: [
          { icon: Zap, title: 'Onboarding Optimization', description: '40% of new users drop off at step 3. Simplify the setup wizard to reduce friction.', type: 'warning' },
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
        heading: '30-Day Forecast',
        icon: TrendingUp,
        items: [
          { icon: TrendingUp, title: 'DAU Projection', value: '2,800–3,100', description: 'Expected 8-12% growth based on current trajectory', type: 'positive' },
          { icon: Target, title: 'Churn Forecast', value: '1.8%', description: 'Expected to decrease with current retention initiatives', type: 'positive' },
          { icon: BarChart3, title: 'Revenue Impact', value: '+5.2%', description: 'Projected MRR growth based on conversion trends', type: 'positive' },
        ],
      },
      {
        heading: 'Confidence',
        icon: CheckCircle2,
        items: [
          { icon: CheckCircle2, title: 'Prediction Confidence', value: '82%', description: 'Based on 90-day rolling averages and current growth trajectory', type: 'info' },
        ],
      },
    ];
  }

  return [
    {
      heading: 'Analysis Summary',
      icon: BarChart3,
      items: [
        { icon: Users, title: 'Total Users', value: String(stats.total), description: `${stats.active} active, ${stats.inactive} inactive`, type: 'info' },
        { icon: BarChart3, title: 'Projects', value: String(projects.length), description: `${projects.filter(p => p.status === 'active').length} active projects`, type: 'neutral' },
        { icon: TrendingUp, title: 'DAU', value: kpis[0].value, description: 'Current daily active users', type: 'positive' },
      ],
    },
    {
      heading: 'What I Can Help With',
      icon: Lightbulb,
      items: [
        { icon: ArrowRight, title: 'Insights', description: 'Analyze dashboard metrics and KPIs', type: 'info' },
        { icon: ArrowRight, title: 'Anomaly Detection', description: 'Find data irregularities and spikes', type: 'info' },
        { icon: ArrowRight, title: 'Predictions', description: 'Forecast trends and growth', type: 'info' },
        { icon: ArrowRight, title: 'Recommendations', description: 'Get actionable improvement suggestions', type: 'info' },
      ],
    },
  ];
};

const typeColors = {
  positive: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
  neutral: 'bg-muted/50 border-border',
  info: 'bg-primary/5 border-primary/20',
};

const typeIconColors = {
  positive: 'text-success',
  warning: 'text-warning',
  neutral: 'text-muted-foreground',
  info: 'text-primary',
};

const AIMessageContent = ({ sections }: { sections: AISectionBlock[] }) => (
  <div className="space-y-4">
    {sections.map((section, si) => (
      <div key={si}>
        <div className="flex items-center gap-2 mb-2">
          <section.icon className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">{section.heading}</h4>
        </div>
        <div className="space-y-2">
          {section.items.map((item, ii) => (
            <div key={ii} className={cn('flex items-start gap-3 p-3 rounded-lg border', typeColors[item.type])}>
              <item.icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', typeIconColors[item.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  {item.value && (
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      sections: [
        {
          heading: `Welcome, ${user?.name || 'there'}!`,
          icon: Bot,
          items: [
            { icon: Lightbulb, title: 'AI Analytics Assistant', description: 'I can analyze your product data, detect anomalies, predict trends, and provide actionable recommendations.', type: 'info' },
          ],
        },
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    const sections = generateAIResponse(text, user?.name || 'User');
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', sections, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Powered by analytics intelligence</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] rounded-2xl px-4 py-3', msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card card-shadow text-foreground rounded-bl-md')}>
                {msg.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : msg.sections ? (
                  <AIMessageContent sections={msg.sections} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                <p className={cn('text-[10px] mt-1.5', msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card card-shadow rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.query)}
                className="flex items-center gap-2 p-3 rounded-xl bg-card card-shadow hover:card-shadow-lg transition-all text-left group"
              >
                <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask me about your analytics..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
