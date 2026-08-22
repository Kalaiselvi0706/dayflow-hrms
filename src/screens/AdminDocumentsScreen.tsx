import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { Document } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { NotificationToast } from '../components/common/NotificationToast';

export const AdminDocumentsScreen: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocuments();
      setDocs(data);
    } catch (err) {
      setError('Failed to fetch corporate document ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleVerify = async (id: string, status: Document['status']) => {
    try {
      const updated = await documentService.verifyDocument(id, status);
      if (updated) {
        setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
        setToastMessage(`Document successfully marked as ${status}!`);
      }
    } catch (err) {
      setToastMessage('Verification action failed.');
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

      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Corporate Document Command</h2>
          <p className="text-sm text-[#908fa0]">Verify personnel W4/I9 tax files, approve contracts, and manage corporate policy manuals.</p>
        </div>
      </div>

      {!docs.length ? (
        <EmptyState
          icon="folder"
          title="No documents to display"
          description="The corporate documents ledger has no items registered."
        />
      ) : (
        <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#464554]/30 text-xs font-semibold text-[#908fa0] uppercase tracking-wider">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4 font-mono">Size</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#e2e2eb] divide-y divide-[#464554]/15">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#111319]/20 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-white">{doc.title}</div>
                        <div className="text-[10px] text-[#908fa0] font-mono">{doc.fileName}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] bg-[#282a30] text-[#c0c1ff] px-2 py-0.5 rounded border border-[#464554]/30">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">{doc.uploadedBy}</td>
                    <td className="py-4 px-4 font-mono">{doc.fileSize}</td>
                    <td className="py-4 px-4">{doc.uploadDate}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button variant="secondary" icon="download" className="py-1 px-2.5">
                        Get
                      </Button>
                      {doc.status === 'Pending' && (
                        <>
                          <Button
                            variant="primary"
                            className="py-1 px-2.5"
                            onClick={() => handleVerify(doc.id, 'Verified')}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="danger"
                            className="py-1 px-2.5"
                            onClick={() => handleVerify(doc.id, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
