import { Document } from '../types';
import { api } from './api';

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    return api.get('/api/documents');
  },

  async getDocumentsByEmployee(employeeId: string): Promise<Document[]> {
    // Backend automatically handles token validation and scopes employee docs appropriately
    const allDocs = await api.get('/api/documents');
    return allDocs.filter((d: Document) => d.employeeId === employeeId);
  },

  async uploadDocument(
    title: string,
    fileName: string,
    category: Document['category'],
    uploadedBy: string,
    employeeId?: string,
    employeeName?: string
  ): Promise<Document> {
    return api.post('/api/documents', {
      title,
      fileName,
      category,
      uploadedBy,
      employeeId,
      employeeName,
      size: `${(1 + Math.random() * 5).toFixed(1)} MB`
    });
  },

  async verifyDocument(id: string, status: Document['status']): Promise<Document | null> {
    return api.put(`/api/documents/${id}`, { status });
  },
};
