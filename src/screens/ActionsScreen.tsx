import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { NotificationToast } from '../components/common/NotificationToast';

export const ActionsScreen: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const triggerAction = (msg: string) => {
    setToast(msg);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <NotificationToast message={toast} onClose={() => setToast(null)} />

      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manual Operational Actions</h2>
        <p className="text-sm text-[#908fa0]">Trigger instant workforce operations, system synchronizations, and operational notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#8083ff]">sync</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sync Directory</h4>
          </div>
          <p className="text-xs text-[#908fa0] leading-relaxed">
            Instantly sync directory databases with OKTA SSO, active directory, and facial biometric sensors.
          </p>
          <Button variant="primary" icon="bolt" onClick={() => triggerAction('SSO Directory Database synchronization triggered successfully!')}>
            Synchronize Now
          </Button>
        </div>

        <div className="p-6 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-400">lock_reset</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Secured Key Rotation</h4>
          </div>
          <p className="text-xs text-[#908fa0] leading-relaxed">
            Rotate all biometric encryption keys and neural credentials. All client sessions will remain active.
          </p>
          <Button variant="danger" icon="security" onClick={() => triggerAction('Rotated secured biometric key credentials across all zones.')}>
            Rotate Keys
          </Button>
        </div>

        <div className="p-6 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400">notifications_active</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Broadcast Warning</h4>
          </div>
          <p className="text-xs text-[#908fa0] leading-relaxed">
            Send a global warning to all employee dashboards regarding planned scheduling updates or downtime.
          </p>
          <Button variant="secondary" icon="campaign" onClick={() => triggerAction('Downtime warning broadcasted to all logged-in devices.')}>
            Broadcast Alert
          </Button>
        </div>

        <div className="p-6 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-cyan-300">database</span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Database Snapshot</h4>
          </div>
          <p className="text-xs text-[#908fa0] leading-relaxed">
            Create an encrypted cold snapshot of the complete employees database, logs, and pay history.
          </p>
          <Button variant="secondary" icon="save" onClick={() => triggerAction('Created cold backup database snapshot (backup_oct_23.sql).')}>
            Create Snapshot
          </Button>
        </div>
      </div>
    </div>
  );
};
