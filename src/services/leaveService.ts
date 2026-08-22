import { LeaveRequest } from '../types';
import { api } from './api';

export const leaveService = {
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return api.get('/api/leave');
  },

  async submitLeaveRequest(req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): Promise<LeaveRequest> {
    return api.post('/api/leave', req);
  },

  async approveLeaveRequest(id: string): Promise<boolean> {
    await api.put(`/api/leave/${id}/approve`);
    return true;
  },

  async rejectLeaveRequest(id: string): Promise<boolean> {
    await api.put(`/api/leave/${id}/reject`);
    return true;
  },
};
