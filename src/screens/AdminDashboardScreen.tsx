import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee, LeaveRequest } from '../types';
import { employeeService } from '../services/employeeService';
import { leaveService } from '../services/leaveService';
import { NotificationToast } from '../components/common/NotificationToast';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const emps = await employeeService.getEmployees();
      const leaves = await leaveService.getLeaveRequests();
      setEmployees(emps);
      setLeaveRequests(leaves);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveLeave = async (id: string) => {
    const success = await leaveService.approveLeaveRequest(id);
    if (success) {
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req))
      );
      setToastMessage('Leave request approved successfully!');
    }
  };

  const handleRejectLeave = async (id: string) => {
    const success = await leaveService.rejectLeaveRequest(id);
    if (success) {
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
      );
      setToastMessage('Leave request rejected.');
    }
  };

  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending');

  const triggerAction = (msg: string) => {
    setToastMessage(msg);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

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
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Top Banner / Pulse Summary */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Autonomous Operations Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Workforce Command Center
          </h2>
          <p className="text-sm text-[#908fa0] max-w-2xl">
            Real-time neural telemetry covering 124 active personnel across San Francisco, New York, and Austin hubs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/admin/attendance')}
            className="px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">sensors</span>
            Telemetry Stream
          </button>
          <button
            onClick={() => navigate('/admin/ai')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all shadow-md shadow-[#8083ff]/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            Ask AI Intelligence
          </button>
        </div>
      </div>

      {/* 6 Bento KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Workforce',
            value: '124',
            delta: '+4 this month',
            icon: 'groups',
            color: 'text-[#c0c1ff]',
            border: 'border-[#8083ff]/30',
          },
          {
            label: 'Active Now',
            value: '118',
            delta: '95.2% on duty',
            icon: 'check_circle',
            color: 'text-emerald-400',
            border: 'border-emerald-500/30',
          },
          {
            label: 'On Leave',
            value: '4',
            delta: '3 PTO • 1 Sick',
            icon: 'flight_takeoff',
            color: 'text-cyan-300',
            border: 'border-cyan-500/30',
          },
          {
            label: 'Late Check-ins',
            value: '2',
            delta: 'Avg 09:24 AM',
            icon: 'warning',
            color: 'text-amber-400',
            border: 'border-amber-500/30',
          },
          {
            label: 'Pending Leaves',
            value: pendingRequests.length.toString(),
            delta: 'Requires review',
            icon: 'pending_actions',
            color: 'text-[#d0bcff]',
            border: 'border-[#a078ff]/30',
            onClick: () => setReviewModalOpen(true),
          },
          {
            label: 'Missing Checkout',
            value: '1',
            delta: 'Auto-ping sent',
            icon: 'schedule',
            color: 'text-rose-400',
            border: 'border-rose-500/30',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            onClick={kpi.onClick}
            className={`rounded-2xl bg-[#1e1f26]/70 border ${kpi.border} p-4 backdrop-blur-md flex flex-col justify-between hover:bg-[#282a30]/80 transition-all ${
              kpi.onClick ? 'cursor-pointer hover:scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between text-[#908fa0] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{kpi.label}</span>
              <span className={`material-symbols-outlined text-base ${kpi.color}`}>{kpi.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="text-[10px] text-[#908fa0] mt-0.5">{kpi.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Smart Insight Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1e1f26] via-[#282a30] to-[#1e1f26] border border-[#a078ff]/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden ai-glow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#a078ff] p-[2px] shrink-0">
              <div className="w-full h-full bg-[#111319] rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#d0bcff] text-2xl">auto_awesome</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d0bcff]">Nexora AI Intelligence</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-semibold">99.4% Confidence</span>
              </div>
              <h3 className="text-base font-bold text-white">Engineering Productivity Index +15% with 0% unexcused absence</h3>
              <p className="text-xs text-[#908fa0] max-w-2xl">
                Marcus Reed (Sales) recorded 3 late check-ins this week due to Austin traffic. Automated slack notification scheduled for 1:1 check-in.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => triggerAction('Executive Brief generated and sent to alex.rivers@nexora.internal')}
              className="px-4 py-2 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all"
            >
              Export Report
            </button>
            <button
              onClick={() => triggerAction('Auto-Resolution applied: Slack check-in ping triggered')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all shadow-md shadow-[#8083ff]/20"
            >
              Run Automation
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Department Breakdown & Pending Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Attendance Health (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Department Presence Distribution</h3>
              <p className="text-xs text-[#908fa0]">Real-time active personnel vs total headcount</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30">
              95.2% Avg Attendance
            </span>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'Engineering', active: 42, total: 45, pct: 93, color: 'from-[#8083ff] to-[#03b5d3]' },
              { dept: 'Design', active: 18, total: 18, pct: 100, color: 'from-emerald-400 to-cyan-400' },
              { dept: 'Marketing', active: 22, total: 24, pct: 91, color: 'from-[#a078ff] to-[#c0c1ff]' },
              { dept: 'Sales', active: 26, total: 28, pct: 92, color: 'from-amber-400 to-orange-400' },
              { dept: 'Finance & HR', active: 10, total: 10, pct: 100, color: 'from-cyan-400 to-blue-500' },
            ].map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#908fa0]">{d.active} / {d.total} Present</span>
                    <span className="font-bold text-[#c0c1ff]">{d.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#111319] overflow-hidden p-0.5 border border-[#464554]/30">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-700`}
                    style={{ width: `${d.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center / Pending Requests */}
        <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#464554]/20">
            <div>
              <h3 className="text-base font-bold text-white">Pending Actions</h3>
              <p className="text-xs text-[#908fa0]">{pendingRequests.length} approvals pending</p>
            </div>
            <button
              onClick={() => navigate('/admin/leave')}
              className="text-xs text-[#8083ff] font-semibold hover:underline"
            >
              All Leaves
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-[#908fa0] text-xs">
                <span className="material-symbols-outlined text-3xl mb-2 text-emerald-400">check_circle</span>
                <p>All pending approvals cleared!</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-[#111319]/70 border border-[#464554]/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#8083ff]/30 text-[#c0c1ff] flex items-center justify-center font-bold text-xs">
                        {req.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.employeeName}</h4>
                        <span className="text-[10px] text-[#908fa0]">{req.type} • {req.duration}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Pending
                    </span>
                  </div>

                  <p className="text-[11px] text-[#908fa0] line-clamp-1 italic">
                    "{req.reason}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={async () => {
                        await leaveService.approveLeaveRequest(req.id);
                        const updatedList = await leaveService.getLeaveRequests();
                        setLeaveRequests(updatedList);
                        triggerAction(`Approved ${req.type} for ${req.employeeName}`);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all border border-emerald-500/40"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        await leaveService.rejectLeaveRequest(req.id);
                        const updatedList = await leaveService.getLeaveRequests();
                        setLeaveRequests(updatedList);
                        triggerAction(`Rejected ${req.type} for ${req.employeeName}`);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-all border border-rose-500/40"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workforce Directory Table Preview */}
      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Workforce Presence Directory</h3>
            <p className="text-xs text-[#908fa0]">Click on any team member to view full dossier</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-sm text-[#908fa0]">search</span>
              <input
                type="text"
                placeholder="Search staff, code, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111319] border border-[#464554]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#908fa0]/60 focus:outline-none focus:border-[#8083ff]"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#111319] border border-[#464554]/40 rounded-xl px-3 py-1.5 text-xs text-[#c0c1ff] focus:outline-none focus:border-[#8083ff]"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#464554]/30 text-[#908fa0] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Code</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464554]/20">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => {
                    navigate(`/admin/employees/${emp.id}`);
                  }}
                  className="hover:bg-[#282a30]/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#8083ff]/30"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center font-bold">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white group-hover:text-[#c0c1ff] transition-colors">
                          {emp.name}
                        </span>
                        <p className="text-[11px] text-[#908fa0]">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#908fa0] font-mono">{emp.code}</td>
                  <td className="py-3.5 text-[#e2e2eb]">{emp.department}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        emp.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : emp.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : emp.status === 'On Leave'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Present'
                            ? 'bg-emerald-400'
                            : emp.status === 'Late'
                            ? 'bg-amber-400'
                            : emp.status === 'On Leave'
                            ? 'bg-cyan-400'
                            : 'bg-rose-400'
                        }`}
                      ></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-[#908fa0]">{emp.location}</td>
                  <td className="py-3.5 text-right">
                    <button className="text-[#8083ff] hover:text-white text-xs font-semibold">
                      View Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
