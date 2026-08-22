import { AutomationWorkflow } from '../types';
import { api } from './api';

export const automationService = {
  async getWorkflows(): Promise<AutomationWorkflow[]> {
    return api.get('/api/automations');
  },

  async toggleWorkflow(id: string): Promise<AutomationWorkflow | null> {
    return api.put(`/api/automations/${id}/toggle`);
  },

  async addWorkflow(wf: Omit<AutomationWorkflow, 'id' | 'runsCount' | 'lastTriggered'>): Promise<AutomationWorkflow> {
    return api.post('/api/automations', wf);
  },
};
