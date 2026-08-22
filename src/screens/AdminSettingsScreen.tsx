import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { NotificationToast } from '../components/common/NotificationToast';

export const AdminSettingsScreen: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    biometricVerify: true,
    facialCheckin: true,
    slackIntegration: false,
    autoApproveLeaves: true,
    weeklyHoursCap: '40',
  });

  const handleSave = () => {
    setToast('Configuration settings updated and broadcasted to node agents!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <NotificationToast message={toast} onClose={() => setToast(null)} />

      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System Settings & Policies</h2>
        <p className="text-sm text-[#908fa0]">Modify directory rules, biometric thresholds, and notification sync webhooks.</p>
      </div>

      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h3 className="text-base font-bold text-white tracking-tight pb-3 border-b border-[#464554]/25">Workforce Configurations</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/40 border border-[#464554]/15 hover:border-[#464554]/40 transition-colors cursor-pointer select-none">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Biometric Location Lock</span>
              <span className="text-[10px] text-[#908fa0] block">Enforce location geo-fencing on checkout biometric verification.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.biometricVerify}
              onChange={(e) => setSettings({ ...settings, biometricVerify: e.target.checked })}
              className="rounded bg-[#111319] border-[#464554] text-[#8083ff] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/40 border border-[#464554]/15 hover:border-[#464554]/40 transition-colors cursor-pointer select-none">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Facelink Face ID</span>
              <span className="text-[10px] text-[#908fa0] block">Use biometric visual scan check-in on employee mobile browsers.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.facialCheckin}
              onChange={(e) => setSettings({ ...settings, facialCheckin: e.target.checked })}
              className="rounded bg-[#111319] border-[#464554] text-[#8083ff] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/40 border border-[#464554]/15 hover:border-[#464554]/40 transition-colors cursor-pointer select-none">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Slack App Bot Notifications</span>
              <span className="text-[10px] text-[#908fa0] block">Sync active workflows with corporate Slack chat workspace alerts.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.slackIntegration}
              onChange={(e) => setSettings({ ...settings, slackIntegration: e.target.checked })}
              className="rounded bg-[#111319] border-[#464554] text-[#8083ff] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/40 border border-[#464554]/15 hover:border-[#464554]/40 transition-colors cursor-pointer select-none">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Auto-Approve Single Day Leaves</span>
              <span className="text-[10px] text-[#908fa0] block">Instant approval rule for sick leaves matching team thresholds.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproveLeaves}
              onChange={(e) => setSettings({ ...settings, autoApproveLeaves: e.target.checked })}
              className="rounded bg-[#111319] border-[#464554] text-[#8083ff] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#111319]/40 border border-[#464554]/15">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Expected Weekly Target Hours</span>
              <span className="text-[10px] text-[#908fa0] block">Used for payroll calculations and overtime reporting triggers.</span>
            </div>
            <input
              type="number"
              value={settings.weeklyHoursCap}
              onChange={(e) => setSettings({ ...settings, weeklyHoursCap: e.target.value })}
              className="w-20 bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-3 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[#8083ff]"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" icon="save" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
