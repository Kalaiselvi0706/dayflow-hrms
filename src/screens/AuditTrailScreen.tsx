import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import { AuditLog } from '../types';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export const AuditTrailScreen: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch audit log trail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
        <SkeletonLoader variant="list" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <ErrorState message={error} onRetry={fetchLogs} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System Operational Audit Trail</h2>
        <p className="text-sm text-[#908fa0]">Traceable ledger of HR directory writes, check-in configurations, and compliance overrides.</p>
      </div>

      {!logs.length ? (
        <EmptyState
          icon="history"
          title="No audit entries"
          description="The operational audit trail database is currently empty."
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-[#1e1f26]/60 border border-[#464554]/20 flex items-center justify-between gap-4 hover:border-[#464554]/45 transition-colors text-xs text-[#e2e2eb]"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#282a30] text-[#c0c1ff] border border-[#464554]/30 flex items-center justify-center font-bold font-mono text-[10px] uppercase shrink-0">
                  {log.action.split(' ').map((w) => w[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-[#908fa0]">by {log.userName} ({log.userRole})</span>
                  </div>
                  <p className="text-[#908fa0] mt-1">{log.details}</p>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[10px] text-[#908fa0] space-y-1">
                <div>{log.timestamp}</div>
                {log.ipAddress && <div className="text-[9px] text-[#8083ff]/65">{log.ipAddress}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
