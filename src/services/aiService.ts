import { AIChatMessage } from '../types';
import { api } from './api';

let localChatMessages: AIChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'ai',
    text: 'Welcome to Nexora Copilot. How can I assist you with your workforce telemetry today?',
    timestamp: '09:00 AM'
  }
];

export const aiService = {
  async getChatHistory(): Promise<AIChatMessage[]> {
    return localChatMessages;
  },

  async getDailySummary(role: 'admin' | 'employee'): Promise<string> {
    const data = await api.post('/api/ai/insights', { role });
    return data.summary || 'Summary not available.';
  },

  async sendMessage(text: string): Promise<AIChatMessage> {
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    localChatMessages = [...localChatMessages, userMsg];

    try {
      const response = await api.post('/api/ai/chat', { message: text });
      const aiMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        widget: response.widget
      };
      localChatMessages = [...localChatMessages, aiMsg];
      return aiMsg;
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `Error parsing query: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      localChatMessages = [...localChatMessages, errorMsg];
      return errorMsg;
    }
  },
};
