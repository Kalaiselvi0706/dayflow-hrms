import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseCanvas } from '../components/PulseCanvas';
import { AttendanceRecord } from '../types';
import { attendanceService } from '../services/attendanceService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { NotificationToast } from '../components/common/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const LiveAttendanceScreen: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getLogs();
      setLogs(data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const [filter, setFilter] = useState<'All' | 'Present' | 'Late' | 'Absent'>('All');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideName, setOverrideName] = useState('');
  const [overrideDept, setOverrideDept] = useState('Engineering');
  const [overrideStatus, setOverrideStatus] = useState<'Present' | 'Late' | 'Absent'>('Present');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'All') return true;
    return log.status === filter;
  });

  const handleCreateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideName.trim()) return;

    const newRec: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeName: overrideName,
      empCode: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: overrideName.split(' ').map((n) => n[0]).join(''),
      department: overrideDept,
      status: overrideStatus,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    await attendanceService.addManualLog(newRec);
    setLogs((prev) => [newRec, ...prev]);
    setShowOverrideModal(false);
    setOverrideName('');
    setNotification(`Manual attendance recorded for ${overrideName}`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="table" count={3} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast */}
      <NotificationToast
        message={notification}
        onClose={() => setNotification(null)}
      />

      {/* Header */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Live Neural Attendance Stream
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Attendance Waveform & Telemetry
          </h2>
          <p className="text-sm text-[#908fa0] max-w-xl">
            Real-time biometric checkpoint verification, geolocation geofencing, and automated anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOverrideModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">edit_calendar</span>
            Manual Check-in Override
          </button>
          <button
            onClick={() => navigate(userRole === 'admin' ? '/admin/ai' : '/employee/ai')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all shadow-md shadow-[#8083ff]/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            Diagnose Anomalies
          </button>
        </div>
      </div>

      {/* Waveform Telemetry Panel */}
      <div className="rounded-3xl bg-[#1a1d26]/90 border border-[#464554]/40 p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">vital_signs</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Biometric Pulse Stream</h3>
              <p className="text-xs text-[#908fa0]">Sampling frequency: 240 packets/sec</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[#908fa0] block">Active On Duty</span>
              <span className="text-base font-bold text-white">118 / 124</span>
            </div>
            <div className="w-[1px] h-8 bg-[#464554]/30"></div>
            <div>
              <span className="text-[#908fa0] block">On-Time Index</span>
              <span className="text-base font-bold text-emerald-400">98.4%</span>
            </div>
            <div className="w-[1px] h-8 bg-[#464554]/30"></div>
            <div>
              <span className="text-[#908fa0] block">Anomaly Rate</span>
              <span className="text-base font-bold text-cyan-300">1.2%</span>
            </div>
          </div>
        </div>

        {/* Live Canvas Graph */}
        <div className="w-full h-52 sm:h-60 rounded-2xl bg-[#111319] border border-[#464554]/40 overflow-hidden relative shadow-inner">
          <PulseCanvas activeEmployees={118} />
          <div className="absolute top-3 left-4 flex items-center gap-2 text-[10px] font-mono text-cyan-300/80 bg-[#111319]/80 px-2.5 py-1 rounded-md border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            LATENCY: 12ms • TIMEZONE: PST
          </div>
        </div>

        {/* AI Root Cause Diagnostic Chip */}
        <div className="p-4 rounded-2xl bg-[#1e1f26] border border-[#8083ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#c0c1ff] text-xl mt-0.5">auto_awesome</span>
            <div>
              <h4 className="text-xs font-bold text-white">AI Diagnostic Insight</h4>
              <p className="text-xs text-[#908fa0]">
                2 late arrivals detected in Austin office correlated with regional I-35 transit congestion.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setNotification('Applied automatic 15-minute grace window for Austin office.');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] border border-[#8083ff]/40 text-xs font-semibold transition-all shrink-0"
          >
            Apply Grace Window
          </button>
        </div>
      </div>

      {/* Realtime Attendance Log Table */}
      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Live Attendance Stream</h3>
            <p className="text-xs text-[#908fa0]">Individual check-in events recorded today</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(['All', 'Present', 'Late', 'Absent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-[#8083ff] text-white shadow-md shadow-[#8083ff]/30'
                    : 'bg-[#282a30] text-[#908fa0] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#464554]/30 text-[#908fa0] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Employee Code</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Check-in Time</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464554]/20">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#282a30]/50 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      {log.avatar && log.avatar.startsWith('http') ? (
                        <img
                          src={log.avatar}
                          alt={log.employeeName}
                          className="w-8 h-8 rounded-full object-cover border border-[#8083ff]/30 animate-pulse-ring"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center font-bold">
                          {log.employeeName ? log.employeeName.charAt(0) : 'E'}
                        </div>
                      )}
                      <span className="font-semibold text-white">{log.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#908fa0] font-mono">{log.empCode}</td>
                  <td className="py-3.5 text-[#e2e2eb]">{log.department}</td>
                  <td className="py-3.5 text-[#c0c1ff] font-mono">{log.time}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        log.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : log.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Present'
                            ? 'bg-emerald-400'
                            : log.status === 'Late'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      ></span>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Biometric Validated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-in Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowOverrideModal(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a1d26] border border-[#464554]/50 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#464554]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8083ff]">edit_calendar</span>
                <h3 className="text-base font-bold text-white">Manual Punch Override</h3>
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-[#908fa0] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Reed"
                  value={overrideName}
                  onChange={(e) => setOverrideName(e.target.value)}
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Department</label>
                <select
                  value={overrideDept}
                  onChange={(e) => setOverrideDept(e.target.value)}
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Status</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as any)}
                  className="w-full bg-[#111319] border border-[#464554]/50 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                >
                  <option value="Present">Present (On-time)</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Absent">Excused Absence</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-xl text-[#908fa0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white font-semibold shadow-md shadow-[#8083ff]/30"
                >
                  Confirm Punch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
