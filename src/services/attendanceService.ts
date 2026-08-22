import { AttendanceRecord } from '../types';
import { api } from './api';

export const attendanceService = {
  async getLogs(): Promise<AttendanceRecord[]> {
    return api.get('/api/attendance');
  },

  async clockIn(employeeName: string, empCode: string, avatar: string, department: string): Promise<AttendanceRecord> {
    return api.post('/api/attendance/check-in', { employeeName, empCode, avatar, department });
  },

  async clockInLate(employeeName: string, empCode: string, avatar: string, department: string, reason: string): Promise<AttendanceRecord> {
    // Punch in is handled by server, we can optionally pass the reason to the backend
    return api.post('/api/attendance/check-in', { employeeName, empCode, avatar, department, reason });
  },

  async clockOut(): Promise<AttendanceRecord> {
    return api.post('/api/attendance/check-out', {});
  },

  async addManualLog(log: AttendanceRecord): Promise<AttendanceRecord> {
    // Log override manually
    return api.post('/api/attendance/check-in', log);
  },
};
