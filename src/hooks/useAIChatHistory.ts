import { useState, useCallback, useEffect } from 'react';
import type { AISectionBlock } from '@/components/ai/AIMessageContent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  sections?: AISectionBlock[];
  timestamp: string; // ISO string for serialisation
}

const CHAT_KEY_PREFIX = 'ai_chat_';

const getChatKey = (userId: string) => `${CHAT_KEY_PREFIX}${userId}`;

export const clearAllAIChatHistory = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CHAT_KEY_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
};

export const clearUserAIChatHistory = (userId: string) => {
  localStorage.removeItem(getChatKey(userId));
};

export const useAIChatHistory = (userId: string | undefined, welcomeSections: AISectionBlock[]) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load on mount / userId change
  useEffect(() => {
    if (!userId) { setMessages([]); return; }
    const raw = localStorage.getItem(getChatKey(userId));
    if (raw) {
      try { setMessages(JSON.parse(raw)); return; } catch { /* fall through */ }
    }
    // Default welcome message
    setMessages([{
      id: '0',
      role: 'assistant',
      sections: welcomeSections,
      timestamp: new Date().toISOString(),
    }]);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist whenever messages change (skip empty)
  useEffect(() => {
    if (!userId || messages.length === 0) return;
    localStorage.setItem(getChatKey(userId), JSON.stringify(messages));
  }, [messages, userId]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const clearHistory = useCallback(() => {
    if (!userId) return;
    localStorage.removeItem(getChatKey(userId));
    setMessages([{
      id: '0',
      role: 'assistant',
      sections: welcomeSections,
      timestamp: new Date().toISOString(),
    }]);
  }, [userId, welcomeSections]);

  return { messages, addMessage, clearHistory };
};
