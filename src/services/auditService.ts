import { AuditLog, UserRole } from '../types';
import { api } from './api';

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    return api.get('/api/audits');
  },

  logAction(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: string,
    details: string
  ): void {
    // Actions are logged implicitly inside server routes on sensitive mutations.
    // If needed, can make optional POST request.
  },
};
