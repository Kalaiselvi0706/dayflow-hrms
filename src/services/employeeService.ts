import { Employee } from '../types';
import { api } from './api';

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    return api.get('/api/employees');
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    return api.get(`/api/employees/${id}`);
  },

  async addEmployee(emp: Omit<Employee, 'id' | 'code' | 'joinDate' | 'status' | 'leaveBalance'>): Promise<Employee> {
    return api.post('/api/employees', emp);
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    return api.put(`/api/employees/${id}`, updates);
  },

  async deleteEmployee(id: string): Promise<boolean> {
    await api.delete(`/api/employees/${id}`);
    return true;
  },
};
