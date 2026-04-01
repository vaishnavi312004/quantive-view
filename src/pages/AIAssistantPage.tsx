import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/services/projectService';
import { kpiData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, Users, Lightbulb, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'Dashboard Insights', icon: TrendingUp, query: 'Give me insights on current dashboard metrics' },
  { label: 'Anomaly Detection', icon: AlertTriangle, query: 'Detect any anomalies in the recent data' },
  { label: 'User Segments', icon: Users, query: 'Analyze user segments and their behavior' },
  { label: 'Recommendations', icon: Lightbulb, query: 'Suggest improvements for product engagement' },
];

const generateAIResponse = (query: string, userName: string): string => {
  const kpis = kpiData();
  const projects = getProjects();
  const q = query.toLowerCase();

  if (q.includes('insight') || q.includes('dashboard') || q.includes('metric')) {
    const dau = kpis[0];
    const churn = kpis[2];
    return `## 📊 Dashboard Insights\n\n**Key Metrics Overview for ${userName}:**\n\n- **DAU** is at **${dau.value}** (${Number(dau.change) >= 0 ? '↑' : '↓'} ${Math.abs(Number(dau.change))}%)\n- **Churn Rate** is **${churn.value}** — ${Number(churn.change) < 0 ? 'improving' : 'needs attention'}\n- **${projects.filter(p => p.status === 'active').length}** active projects running\n\n### 💡 Recommended Actions\n1. Focus retention efforts on Day 7–14 window\n2. Investigate feature adoption for low-usage areas\n3. Schedule a deep-dive review with the analytics team`;
  }

  if (q.includes('anomal')) {
    return `## ⚠️ Anomaly Detection Report\n\n**Detected Anomalies:**\n\n1. **Session Time Spike** — Avg session time increased 35% in the last 48 hours. Possible cause: new feature launch.\n2. **Churn Cluster** — 8 enterprise users showed disengagement signals this week.\n3. **Traffic Pattern** — Unusual traffic from API integrations detected on Tuesday.\n\n### 🔧 Suggested Actions\n- Review the new feature rollout impact\n- Reach out to at-risk enterprise accounts\n- Monitor API usage for suspicious patterns`;
  }

  if (q.includes('segment') || q.includes('user')) {
    return `## 👥 User Segmentation Analysis\n\n| Segment | Users | Retention | Engagement |\n|---------|-------|-----------|------------|\n| Power Users | 12% | 95% | 9.4/10 |\n| Regular | 45% | 78% | 7.2/10 |\n| Casual | 30% | 52% | 4.8/10 |\n| At Risk | 13% | 28% | 2.1/10 |\n\n### 🎯 Key Insight\nThe **"At Risk"** segment grew 3% this month. Consider targeted re-engagement campaigns with personalized onboarding flows.`;
  }

  if (q.includes('recommend') || q.includes('improve') || q.includes('suggest')) {
    return `## 💡 Smart Recommendations\n\n**Based on current data patterns:**\n\n1. **Onboarding Optimization** — 40% of new users drop off at step 3. Simplify the setup wizard.\n2. **Feature Discovery** — Only 28% of users have tried Integrations. Add contextual tooltips.\n3. **Notification Tuning** — Weekly digest open rate is 62%. Test bi-weekly cadence.\n4. **Mobile Experience** — Mobile sessions are 3x shorter. Prioritize mobile UX improvements.\n5. **Project Templates** — Users who use templates have 2x higher retention. Promote them.`;
  }

  if (q.includes('predict') || q.includes('forecast') || q.includes('trend')) {
    return `## 📈 Predictive Analytics\n\n**30-Day Forecast:**\n\n- **DAU Projection**: 2,800–3,100 (↑ 8-12%)\n- **Churn Forecast**: Expected to decrease to 1.8% with current retention initiatives\n- **Revenue Impact**: Projected MRR growth of 5.2% based on conversion trends\n\n### ⚡ Confidence Level: 82%\n\nNote: Predictions based on 90-day rolling averages and current growth trajectory.`;
  }

  return `## 🤖 Analysis Results\n\nI've analyzed your query: "${query}"\n\n**Summary:**\n- ${projects.length} total projects (${projects.filter(p => p.status === 'active').length} active)\n- Current DAU: ${kpis[0].value}\n- Retention Rate: ${kpis[3].value}\n\nI can help you with:\n- **Insights** — Analyze dashboard metrics\n- **Anomaly Detection** — Find data irregularities\n- **User Segmentation** — Understand user groups\n- **Predictions** — Forecast trends\n- **Recommendations** — Get actionable suggestions\n\nTry asking a more specific question!`;
};

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: `👋 Hello ${user?.name || 'there'}! I'm your AI Analytics Assistant. I can analyze your product data, detect anomalies, predict trends, and provide actionable recommendations.\n\nTry the quick actions below or ask me anything!`, timestamp: new Date() },
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
    const response = generateAIResponse(text, user?.name || 'User');
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date() };
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
              <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm', msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card card-shadow text-foreground rounded-bl-md')}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
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
