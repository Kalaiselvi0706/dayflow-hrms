import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';

export const EmployeeProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentEmployee, userRole } = useAuth();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'compensation' | 'notes'>('overview');
  const [timeline, setTimeline] = useState<Employee['careerTimeline']>([]);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const loadEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const targetId = id || currentEmployee?.id;
      if (!targetId) {
        setError('No employee context found.');
        setLoading(false);
        return;
      }
      const data = await employeeService.getEmployeeById(targetId);
      if (data) {
        setEmployee(data);
        setTimeline(data.careerTimeline || []);
      } else {
        setError('Employee not found.');
      }
    } catch (err) {
      setError('Failed to fetch employee dossier.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmployee();
  }, [id, currentEmployee]);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !employee) return;

    const item = {
      id: `c-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      title: newTitle,
      description: newDesc,
      tag: 'Achievement',
    };

    const updatedTimeline = [item, ...timeline];
    setTimeline(updatedTimeline);
    
    // Save to server
    await employeeService.updateEmployee(employee.id, {
      careerTimeline: updatedTimeline,
    });

    setShowAddMilestone(false);
    setNewTitle('');
    setNewDesc('');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="table" count={2} />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ErrorState message={error || 'Profile not loaded'} onRetry={loadEmployee} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Dossier Card */}
      <div className="relative rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-[#8083ff]/50 shadow-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#8083ff] to-[#03b5d3] text-white text-3xl font-bold flex items-center justify-center shadow-xl">
                  {employee.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#1e1f26] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{employee.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Active
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40 font-mono">
                  {employee.code}
                </span>
              </div>

              <p className="text-sm font-medium text-[#c0c1ff]">{employee.role} • {employee.department}</p>

              <div className="flex items-center gap-4 text-xs text-[#908fa0] flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#8083ff]">location_on</span>
                  {employee.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#4cd7f6]">mail</span>
                  {employee.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#a078ff]">calendar_today</span>
                  Joined {employee.joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(userRole === 'admin' ? '/admin/leave' : '/employee/leave')}
              className="px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              Manage Leaves
            </button>
            <button
              onClick={() => navigate(userRole === 'admin' ? '/admin/ai' : '/employee/ai')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold shadow-md shadow-[#8083ff]/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">psychology</span>
              AI Talent Dossier
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 pt-4 border-t border-[#464554]/20 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Executive Overview' },
            { id: 'career', label: 'Career Timeline & Promotions' },
            { id: 'compensation', label: 'Payroll & Benefits' },
            { id: 'notes', label: 'HR Notes & Evaluations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#8083ff] text-white'
                  : 'border-transparent text-[#908fa0] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-[#908fa0] uppercase">Team Retention</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">98%</div>
                <span className="text-[10px] text-emerald-300/80">Top 5% in company</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-[#908fa0] uppercase">Leave Balance</span>
                <div className="text-2xl font-bold text-[#c0c1ff] mt-1">{employee.leaveBalance.available}d</div>
                <span className="text-[10px] text-[#908fa0]">Of 20d total</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-[#908fa0] uppercase">Performance</span>
                <div className="text-2xl font-bold text-cyan-300 mt-1">4.9 / 5</div>
                <span className="text-[10px] text-cyan-300/80">Exceptional</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-[#908fa0] uppercase">Tenure</span>
                <div className="text-2xl font-bold text-[#d0bcff] mt-1">2.8 yrs</div>
                <span className="text-[10px] text-[#908fa0]">Since Jan 2022</span>
              </div>
            </div>

            {/* AI Talent Intelligence Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1e1f26] to-[#282a30] border border-[#8083ff]/40 space-y-3 ai-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8083ff]">auto_awesome</span>
                  <h3 className="text-sm font-bold text-white">Nexora AI Retention & Leadership Assessment</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Flight Risk: 0.4% (Very Low)
                </span>
              </div>
              <p className="text-xs text-[#908fa0] leading-relaxed">
                Alex demonstrates exceptional team alignment and high satisfaction index. Successfully spearheaded the integration of autonomous HR workflows, improving departmental time-to-hire by 44%.
              </p>
            </div>
          </div>

          {/* Leave Status Widget */}
          <div className="p-6 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 space-y-4">
            <h3 className="text-base font-bold text-white">Leave Status</h3>
            <div className="flex items-center justify-center py-4 relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#282a30" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#8083ff"
                  strokeWidth="10"
                  strokeDasharray={`${(employee.leaveBalance.available / employee.leaveBalance.total) * 301.59} 301.59`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white">{employee.leaveBalance.available}</span>
                <span className="text-[10px] text-[#908fa0] uppercase">Days Left</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#464554]/20">
                <span className="text-[#908fa0]">Annual Allocation</span>
                <span className="text-white font-bold">{employee.leaveBalance.total} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#464554]/20">
                <span className="text-[#908fa0]">Days Taken</span>
                <span className="text-white font-bold">{employee.leaveBalance.used} Days</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#908fa0]">Pending Approvals</span>
                <span className="text-amber-300 font-bold">{employee.leaveBalance.pending} Days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Timeline Tab */}
      {(activeTab === 'career' || activeTab === 'overview') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Career Progression & Milestones</h3>
              <p className="text-xs text-[#908fa0]">Historical roles, promotions, and achievements</p>
            </div>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="px-3 py-1.5 rounded-xl bg-[#8083ff]/20 text-[#c0c1ff] hover:bg-[#8083ff]/30 text-xs font-semibold border border-[#8083ff]/40 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Milestone
            </button>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#8083ff] before:via-[#03b5d3] before:to-[#464554]/40">
            {timeline.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#111319] border-2 border-[#8083ff] timeline-node"></div>
                <div className="p-4 rounded-2xl bg-[#111319]/70 border border-[#464554]/30 hover:border-[#8083ff]/50 transition-all space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-[#908fa0] font-mono">{item.date}</span>
                  </div>
                  <p className="text-xs text-[#908fa0] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Milestone Modal */}
          {showAddMilestone && (
            <div className="p-4 rounded-2xl bg-[#111319] border border-[#8083ff]/40 space-y-3">
              <h4 className="text-xs font-bold text-white">Add Career Milestone</h4>
              <input
                type="text"
                placeholder="Milestone title (e.g. Promoted to VP)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2 text-xs text-white"
              />
              <textarea
                placeholder="Description of milestone achievements..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2 text-xs text-white h-20"
              ></textarea>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="px-3 py-1 text-[#908fa0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-4 py-1 rounded-xl bg-[#8083ff] text-white font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compensation Tab */}
      {activeTab === 'compensation' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 space-y-6">
          <h3 className="text-base font-bold text-white">Payroll & Equity Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#111319] border border-[#464554]/30">
              <span className="text-[#908fa0] uppercase block">Base Salary</span>
              <span className="text-xl font-bold text-white mt-1 block">$185,000 / yr</span>
              <span className="text-emerald-400 text-[10px]">Direct Deposit Active</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#111319] border border-[#464554]/30">
              <span className="text-[#908fa0] uppercase block">Equity Allocation</span>
              <span className="text-xl font-bold text-[#c0c1ff] mt-1">45,000 RSUs</span>
              <span className="text-[#908fa0] text-[10px]">Vesting: 4-Year Schedule</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#111319] border border-[#464554]/30">
              <span className="text-[#908fa0] uppercase block">Health & Benefits</span>
              <span className="text-xl font-bold text-cyan-300 mt-1">Platinum Plan</span>
              <span className="text-[#908fa0] text-[10px]">Medical + Dental + Vision</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 space-y-4">
          <h3 className="text-base font-bold text-white">Confidential HR Record Notes</h3>
          <p className="text-xs text-[#908fa0]">
            Alex Rivers continues to exceed all managerial OKRs. Promoted in Q4 2023 with glowing executive feedback.
          </p>
        </div>
      )}
    </div>
  );
};
