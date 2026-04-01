import { useState, useRef, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { generateAIResponse } from '@/services/aiResponseService';
import AIMessageContent from '@/components/ai/AIMessageContent';
import type { AISectionBlock } from '@/components/ai/AIMessageContent';
import { useAIChatHistory, type ChatMessage } from '@/hooks/useAIChatHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, TrendingUp, AlertTriangle, Users, Lightbulb, Trash2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickActions = [
  { label: 'Dashboard Insights', icon: TrendingUp, query: 'Give me insights on current dashboard metrics' },
  { label: 'Anomaly Detection', icon: AlertTriangle, query: 'Detect any anomalies in the recent data' },
  { label: 'User Segments', icon: Users, query: 'Analyze user segments and their behavior' },
  { label: 'Predictions', icon: BarChart3, query: 'Predict upcoming engagement and growth trends' },
  { label: 'Recommendations', icon: Lightbulb, query: 'Suggest improvements for product engagement' },
];

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeSections = useMemo<AISectionBlock[]>(() => [{
    heading: `Welcome, ${user?.name || 'there'}!`,
    icon: Bot,
    items: [
      { icon: Lightbulb, title: '🧠 AI Analytics Assistant', description: 'I can analyze your product data, detect anomalies, predict trends, and provide actionable recommendations — all based on your current role and dashboard context.', type: 'info' },
    ],
  }], [user?.name]);

  const { messages, addMessage, clearHistory } = useAIChatHistory(user?.id, welcomeSections);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    const sections = generateAIResponse(text, {
      userName: user?.name || 'User',
      userRole: user?.role || 'user',
      userEmail: user?.email || '',
    });
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', sections, timestamp: new Date().toISOString() };
    addMessage(aiMsg);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Powered by analytics intelligence · {user?.role}</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-xs">Clear History</span>
            </Button>
          )}
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
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {/* Quick Actions — always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.query)}
              disabled={loading}
              className="flex items-center gap-2 p-3 rounded-xl bg-card card-shadow hover:card-shadow-lg transition-all text-left group disabled:opacity-50"
            >
              <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about your analytics — e.g. 'Why is churn rising?'"
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
