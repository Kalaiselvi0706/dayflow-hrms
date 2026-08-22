import { Notification } from '../types';
import { api } from './api';

export const notificationService = {
  async getNotifications(userId?: string): Promise<Notification[]> {
    return api.get('/api/notifications');
  },

  async markAsRead(id: string): Promise<boolean> {
    await api.put(`/api/notifications/${id}/read`);
    return true;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    // Optionally trigger read-all on API or just resolve locally
    return true;
  },

  async broadcast(title: string, message: string, type: Notification['type'] = 'info'): Promise<Notification> {
    return api.post('/api/notifications', { title, message, type, employeeId: 'all' });
  },

  async sendToUser(userId: string, title: string, message: string, type: Notification['type'] = 'info'): Promise<Notification> {
    return api.post('/api/notifications', { title, message, type, employeeId: userId });
  },
};
