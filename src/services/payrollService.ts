import { Payroll } from '../types';
import { api } from './api';

export const payrollService = {
  async getPayrolls(): Promise<Payroll[]> {
    return api.get('/api/payroll');
  },

  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return api.get(`/api/payroll/${employeeId}`);
  },

  async updatePayrollStatus(employeeId: string, status: Payroll['status']): Promise<Payroll | null> {
    return api.put(`/api/payroll/${employeeId}`, { status });
  },

  async addPayrollRecord(record: Omit<Payroll, 'id'>): Promise<Payroll> {
    // Record creation is handled implicitly, or call POST if needed
    return api.post('/api/payroll', record);
  },
};
