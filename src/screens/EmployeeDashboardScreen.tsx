import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { NotificationToast } from '../components/common/NotificationToast';

export const EmployeeDashboardScreen: React.FC = () => {
  const { currentEmployee } = useAuth();
  const navigate = useNavigate();

  const employee = currentEmployee || {
    id: 'emp-1',
    name: 'Alex Rivers',
    code: 'EMP-2022-041',
    role: 'HR Director',
    department: 'HR' as const,
    avatar: '',
    leaveBalance: { total: 20, available: 15, used: 5, pending: 0 }
  };

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(16938); // ~4h 42m 18s
  const [showToast, setShowToast] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn && !isOnBreak) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, isOnBreak]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggleCheckIn = async () => {
    if (isCheckedIn) {
      await attendanceService.clockOut();
      setIsCheckedIn(false);
      setIsOnBreak(false);
      setShowToast('Successfully clocked out for today. See you tomorrow, ' + employee.name.split(' ')[0] + '!');
    } else {
      await attendanceService.clockIn(
        employee.name,
        employee.code,
        employee.avatar || '',
        employee.department
      );
      setIsCheckedIn(true);
      setSecondsElapsed(0);
      setShowToast('Successfully clocked in via face biometric match!');
    }
  };

  const handleToggleBreak = () => {
    if (!isCheckedIn) return;
    setIsOnBreak(!isOnBreak);
    setShowToast(!isOnBreak ? 'Break started (30m timer active)' : 'Break ended. Welcome back!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      <NotificationToast
        message={showToast}
        onClose={() => setShowToast(null)}
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e1f26]/90 via-[#282a30]/80 to-[#1e1f26]/90 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8083ff]">
                Employee Workspace
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Regular Shift
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good morning, {employee.name.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-[#908fa0] max-w-xl">
              You are currently synced with the San Francisco HQ timezone. All neural HR workflows and calendar syncs are nominal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/employee/leave')}
              className="px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              Request Time Off
            </button>
            <button
              onClick={() => navigate('/employee/ai')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all shadow-md shadow-[#8083ff]/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              Ask AI Copilot
            </button>
          </div>
        </div>
      </div>


      {/* Main Grid: Attendance Counter + Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realtime Attendance / Check-In Card (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#464554]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40 flex items-center justify-center">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Attendance Pulse</h3>
                <p className="text-xs text-[#908fa0]">Biometric location verification enabled</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? (isOnBreak ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse') : 'bg-[#908fa0]'}`}></span>
              <span className="text-xs font-semibold text-white">
                {isCheckedIn ? (isOnBreak ? 'ON BREAK' : 'ACTIVE SHIFT') : 'CLOCKED OUT'}
              </span>
            </div>
          </div>

          {/* Time Counter Display */}
          <div className="my-8 text-center py-6 px-4 rounded-2xl bg-[#111319]/80 border border-[#464554]/40 relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#908fa0] mb-2">
              {isCheckedIn ? (isOnBreak ? 'Break Time Running' : 'Elapsed Working Hours') : 'Shift Inactive'}
            </p>
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e2eb] to-[#c0c1ff] font-mono">
              {formatTime(secondsElapsed)}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#908fa0]">
              <span>Check-in: <strong className="text-white">09:00 AM</strong></span>
              <span>•</span>
              <span>Expected Out: <strong className="text-white">06:00 PM</strong></span>
              <span>•</span>
              <span>Target: <strong className="text-[#c0c1ff]">8.0 Hours</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              id="clock-toggle-btn"
              onClick={handleToggleCheckIn}
              className={`py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                isCheckedIn
                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shadow-rose-500/10'
                  : 'bg-gradient-to-r from-[#8083ff] to-[#03b5d3] text-white hover:scale-[1.01] shadow-[#8083ff]/30'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isCheckedIn ? 'logout' : 'login'}
              </span>
              {isCheckedIn ? 'Clock Out Shift' : 'Clock In Now'}
            </button>

            <button
              id="break-toggle-btn"
              disabled={!isCheckedIn}
              onClick={handleToggleBreak}
              className={`py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border ${
                isOnBreak
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#282a30] hover:bg-[#33343b] text-[#e2e2eb] border-[#464554]/50'
              } ${!isCheckedIn ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-lg">coffee</span>
              {isOnBreak ? 'Resume Working' : 'Take 30m Break'}
            </button>
          </div>
        </div>

        {/* Leave Balance Donut & Quick Breakdown */}
        <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#464554]/20">
            <div>
              <h3 className="text-base font-bold text-white">Leave Balance</h3>
              <p className="text-xs text-[#908fa0]">Annual Allocation 2024</p>
            </div>
            <button
              onClick={() => navigate('/employee/leave')}
              className="text-xs text-[#8083ff] font-semibold hover:underline"
            >
              View Hub
            </button>
          </div>

          {/* Donut graphic */}
          <div className="my-6 flex items-center justify-center relative">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#282a30" strokeWidth="12" />
              {/* Used circle slice (5/20 = 25%) */}
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#a078ff"
                strokeWidth="12"
                strokeDasharray={`${(5 / 20) * 301.59} 301.59`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Available circle slice (15/20 = 75%) */}
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#4cd7f6"
                strokeWidth="12"
                strokeDasharray={`${(15 / 20) * 301.59} 301.59`}
                strokeDashoffset={`${-(5 / 20) * 301.59}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white">{employee.leaveBalance.available}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#908fa0]">Days Available</span>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#111319]/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
                <span className="text-[#908fa0]">Paid Annual Leave</span>
              </div>
              <span className="font-bold text-white">{employee.leaveBalance.available} Days Left</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#111319]/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#a078ff]"></span>
                <span className="text-[#908fa0]">Used This Year</span>
              </div>
              <span className="font-bold text-white">{employee.leaveBalance.used} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Weekly Hours Distribution + Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Distribution */}
        <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">October Working Hours</h3>
              <p className="text-xs text-[#908fa0]">Weekly target: 40.0 hrs</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#8083ff]/10 text-[#c0c1ff] font-semibold">
              159.2 hrs total
            </span>
          </div>

          {/* Bar chart mockup */}
          <div className="pt-6 space-y-4">
            {[
              { week: 'Week 1 (Oct 1 - 7)', hours: 40.5, target: 40, pct: 100 },
              { week: 'Week 2 (Oct 8 - 14)', hours: 38.0, target: 40, pct: 95 },
              { week: 'Week 3 (Oct 15 - 21)', hours: 42.2, target: 40, pct: 105 },
              { week: 'Week 4 (Oct 22 - 28)', hours: 38.5, target: 40, pct: 96 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e2e2eb] font-medium">{item.week}</span>
                  <span className="text-[#c0c1ff] font-bold">{item.hours} hrs</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#111319] overflow-hidden p-0.5 border border-[#464554]/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8083ff] to-[#03b5d3] transition-all duration-1000"
                    style={{ width: `${Math.min(item.pct, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Activity & Logs</h3>
            <span className="text-xs text-[#908fa0]">Synced from Mobile & Slack</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: 'fingerprint',
                title: 'Clocked in via Biometric Facial ID',
                time: 'Today at 09:00 AM',
                tag: 'Attendance',
                tagColor: 'text-emerald-400 bg-emerald-500/10',
              },
              {
                icon: 'flight_takeoff',
                title: 'Submitted Holiday Leave Request (Dec 22-26)',
                time: 'Yesterday at 04:30 PM',
                tag: 'Leave',
                tagColor: 'text-[#8083ff] bg-[#8083ff]/10',
              },
              {
                icon: 'task_alt',
                title: 'Approved Marcus Johnson Q3 Onboarding Checklist',
                time: 'Oct 22 at 11:15 AM',
                tag: 'Workflow',
                tagColor: 'text-cyan-300 bg-cyan-500/10',
              },
              {
                icon: 'auto_awesome',
                title: 'Nexora AI generated Weekly Team Retention Brief',
                time: 'Oct 21 at 09:00 AM',
                tag: 'AI Report',
                tagColor: 'text-[#d0bcff] bg-[#a078ff]/10',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#111319]/50 border border-[#464554]/20 hover:border-[#464554]/50 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#282a30] text-[#c0c1ff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{activity.title}</h4>
                  <p className="text-[11px] text-[#908fa0]">{activity.time}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0 ${activity.tagColor}`}>
                  {activity.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
