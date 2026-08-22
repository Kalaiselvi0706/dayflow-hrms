import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import { Document } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { Drawer } from '../components/common/Drawer';
import { NotificationToast } from '../components/common/NotificationToast';

export const DocumentsScreen: React.FC = () => {
  const { currentEmployee } = useAuth();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Document['category']>('Tax');
  const [file, setFile] = useState<string>('');

  const fetchDocs = async () => {
    if (!currentEmployee) return;
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocumentsByEmployee(currentEmployee.id);
      setDocs(data);
    } catch (err) {
      setError('Failed to fetch personal documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [currentEmployee]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;
    try {
      const newDoc = await documentService.uploadDocument(
        title,
        file || 'uploaded_document.pdf',
        category,
        currentEmployee.name,
        currentEmployee.id,
        currentEmployee.name
      );
      setDocs((prev) => [newDoc, ...prev]);
      setIsDrawerOpen(false);
      setTitle('');
      setCategory('Tax');
      setFile('');
      setToastMessage('Document uploaded and queued for HR verification!');
    } catch (err) {
      setToastMessage('Upload failed.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="table" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={fetchDocs} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Your Document Dossier</h2>
          <p className="text-sm text-[#908fa0]">Upload resumes, tax certifications, W4 templates, and signed work agreements.</p>
        </div>
        <Button variant="primary" icon="upload" onClick={() => setIsDrawerOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* Document Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Upload Document Form"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="upload-doc-form">
              Upload File
            </Button>
          </>
        }
      >
        <form id="upload-doc-form" onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider mb-2">
              Document Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. W4 Form 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#908fa0]/50 focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-4 py-2.5 text-sm text-[#c0c1ff] focus:outline-none focus:border-[#8083ff]"
            >
              <option value="Tax">Tax Form</option>
              <option value="ID Proof">Identification Proof</option>
              <option value="Contract">Work Agreement / Contract</option>
              <option value="Resume">Resume / CV Draft</option>
              <option value="Other">Other Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider mb-2">
              Select Virtual File
            </label>
            <input
              type="text"
              required
              placeholder="filename.pdf"
              value={file}
              onChange={(e) => setFile(e.target.value)}
              className="w-full bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#908fa0]/50 focus:outline-none focus:border-[#8083ff]"
            />
          </div>
        </form>
      </Drawer>

      {/* Docs Grid */}
      {!docs.length ? (
        <EmptyState
          icon="folder"
          title="No uploaded documents"
          description="Your personal document space is currently empty. Click above to upload a file."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md flex flex-col justify-between h-48 hover:border-[#8083ff]/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#8083ff]">{doc.category}</span>
                  <StatusBadge status={doc.status} />
                </div>
                <h4 className="text-sm font-bold text-white mt-2 group-hover:text-[#c0c1ff] transition-colors line-clamp-1">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-[#908fa0] mt-1 font-mono">{doc.fileName} ({doc.fileSize})</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#464554]/20 pt-4 mt-auto">
                <span className="text-[10px] text-[#908fa0]">Uploaded: {doc.uploadDate}</span>
                <Button variant="secondary" icon="download" className="py-1 px-2.5">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
