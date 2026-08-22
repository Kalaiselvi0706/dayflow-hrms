import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest } from '../types';
import { leaveService } from '../services/leaveService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { NotificationToast } from '../components/common/NotificationToast';

export const LeaveHubScreen: React.FC = () => {
  const { currentEmployee, userRole } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadLeave = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaveRequests();
      // If employee, show only self requests. If admin, show all requests.
      if (userRole === 'employee' && currentEmployee) {
        setLeaveRequests(data.filter((r) => r.empCode === currentEmployee.code));
      } else {
        setLeaveRequests(data);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadLeave();
  }, [currentEmployee, userRole]);

  const onSubmitLeave = async (req: LeaveRequest) => {
    try {
      const added = await leaveService.submitLeaveRequest(req);
      setLeaveRequests((prev) => [added, ...prev]);
    } catch (err) {}
  };

  const [naturalInput, setNaturalInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<{
    type: LeaveRequest['type'];
    dates: string;
    duration: string;
    reason: string;
    impact: string;
  } | null>(null);

  // Manual fallback form state
  const [manualType, setManualType] = useState<LeaveRequest['type']>('Annual Leave');
  const [manualDuration, setManualDuration] = useState('3 Days');
  const [manualDates, setManualDates] = useState('Nov 14 - Nov 16');
  const [manualReason, setManualReason] = useState('Family gathering');

  const handleParseNaturalLeave = (query: string) => {
    setNaturalInput(query);
    setIsParsing(true);
    setParsedPlan(null);

    setTimeout(() => {
      let type: LeaveRequest['type'] = 'Annual Leave';
      let dates = 'Dec 18 - Dec 22';
      let duration = '5 Days';
      let reason = query;
      let impact = '0 conflicts detected with engineering sprint schedule';

      if (query.toLowerCase().includes('sick') || query.toLowerCase().includes('dental') || query.toLowerCase().includes('doctor') || query.toLowerCase().includes('medical')) {
        type = 'Sick Leave';
        dates = 'Oct 28 (1 Day)';
        duration = '1 Day';
        impact = 'Team coverage is 96% optimal';
      } else if (query.toLowerCase().includes('friday')) {
        type = 'Annual Leave';
        dates = 'This Friday (1 Day)';
        duration = '1 Day';
        impact = 'Low meeting load scheduled for Friday';
      } else if (query.toLowerCase().includes('holiday') || query.toLowerCase().includes('december')) {
        type = 'Annual Leave';
        dates = 'Dec 22 - Dec 29';
        duration = '6 Days';
        impact = 'During standard holiday sprint freeze';
      }

      setParsedPlan({
        type,
        dates,
        duration,
        reason: reason || 'Planned time off',
        impact,
      });
      setIsParsing(false);
    }, 600);
  };

  const handleConfirmLeave = () => {
    if (!parsedPlan) return;
    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeName: 'Alex Rivers',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ',
      empCode: 'EMP-2022-041',
      type: parsedPlan.type,
      dates: parsedPlan.dates,
      duration: parsedPlan.duration,
      reason: parsedPlan.reason,
      status: 'Pending',
      appliedDate: 'Today',
    };

    onSubmitLeave(newReq);
    setParsedPlan(null);
    setNaturalInput('');
    setToast('Leave request submitted to automated approval queue!');
    setTimeout(() => setToast(null), 3500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeName: 'Alex Rivers',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ',
      empCode: 'EMP-2022-041',
      type: manualType,
      dates: manualDates,
      duration: manualDuration,
      reason: manualReason,
      status: 'Pending',
      appliedDate: 'Today',
    };

    onSubmitLeave(newReq);
    setToast('Manual leave request submitted!');
    setTimeout(() => setToast(null), 3500);
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
        message={toast}
        onClose={() => setToast(null)}
      />

      {/* Top Banner */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a078ff]">
              Time Off & Absence Management
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Leave & Time Off Hub
          </h2>
          <p className="text-sm text-[#908fa0] max-w-xl">
            Submit time off via conversational AI or manual schedule selectors with instant conflict verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/profile')}
            className="px-4 py-2.5 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] border border-[#464554]/50 text-xs font-semibold transition-all"
          >
            My Allocation
          </button>
          <button
            onClick={() => navigate('/employee/ai')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all shadow-md shadow-[#8083ff]/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            AI Schedule Advisor
          </button>
        </div>
      </div>

      {/* AI Leave Assistant Box (Prominent Feature) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1e1f26] via-[#282a30] to-[#1e1f26] border border-[#a078ff]/50 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden ai-glow space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#a078ff] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#111319] rounded-[9px] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d0bcff]">psychology</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nexora AI Leave Assistant</h3>
            <p className="text-xs text-[#908fa0]">Type in natural language to formulate your leave schedule</p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="e.g., 'I need next Monday and Tuesday off for dental surgery' or 'Taking next Friday for personal rest'"
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleParseNaturalLeave(naturalInput);
            }}
            className="w-full bg-[#111319] border border-[#464554]/50 rounded-2xl pl-4 pr-32 py-3.5 text-xs sm:text-sm text-white placeholder-[#908fa0]/60 focus:outline-none focus:border-[#a078ff]"
          />
          <button
            onClick={() => handleParseNaturalLeave(naturalInput)}
            disabled={isParsing || !naturalInput.trim()}
            className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50"
          >
            {isParsing ? 'Analyzing...' : 'Parse with AI'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#908fa0] text-[11px]">Quick Prompts:</span>
          {[
            'Take this Friday off for personal errands',
            'Sick leave for tomorrow due to medical checkup',
            '5 days holiday vacation from Dec 22 to Dec 29',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleParseNaturalLeave(prompt)}
              className="px-3 py-1 rounded-lg bg-[#111319]/80 hover:bg-[#111319] text-[#c0c1ff] border border-[#464554]/30 hover:border-[#8083ff]/50 text-[11px] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Parsed Result Card */}
        {parsedPlan && (
          <div className="p-5 rounded-2xl bg-[#111319]/90 border border-emerald-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>AI Structured Schedule Proposal</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                100% Parsed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#1e1f26] border border-[#464554]/20">
                <span className="text-[#908fa0] uppercase text-[10px] block">Category</span>
                <span className="font-bold text-white">{parsedPlan.type}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e1f26] border border-[#464554]/20">
                <span className="text-[#908fa0] uppercase text-[10px] block">Duration</span>
                <span className="font-bold text-[#c0c1ff]">{parsedPlan.duration}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e1f26] border border-[#464554]/20">
                <span className="text-[#908fa0] uppercase text-[10px] block">Dates</span>
                <span className="font-bold text-white">{parsedPlan.dates}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e1f26] border border-[#464554]/20">
                <span className="text-[#908fa0] uppercase text-[10px] block">Team Impact</span>
                <span className="font-bold text-emerald-400">Zero Conflict</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#908fa0] italic">"{parsedPlan.reason}"</span>
              <button
                onClick={handleConfirmLeave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-[#03b5d3] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Submit Request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Balances + Manual Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balances Grid (Span 1) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Your Available Balances</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30">
              <span className="text-[#908fa0] text-[10px] uppercase font-semibold block">Annual Paid</span>
              <div className="text-2xl font-bold text-[#4cd7f6] mt-1">15</div>
              <span className="text-[10px] text-[#908fa0]">Of 20 days</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30">
              <span className="text-[#908fa0] text-[10px] uppercase font-semibold block">Sick / Medical</span>
              <div className="text-2xl font-bold text-[#a078ff] mt-1">8</div>
              <span className="text-[10px] text-[#908fa0]">Of 10 days</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30">
              <span className="text-[#908fa0] text-[10px] uppercase font-semibold block">Compensatory</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">2</div>
              <span className="text-[10px] text-[#908fa0]">Overtime credit</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1e1f26]/70 border border-[#464554]/30">
              <span className="text-[#908fa0] text-[10px] uppercase font-semibold block">Parental</span>
              <div className="text-2xl font-bold text-[#d0bcff] mt-1">12w</div>
              <span className="text-[10px] text-[#908fa0]">Eligible</span>
            </div>
          </div>
        </div>

        {/* Manual Request Form (Span 2) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#464554]/20">
            <h3 className="text-base font-bold text-white">Manual Leave Application</h3>
            <span className="text-xs text-[#908fa0]">Alternative to AI Assistant</span>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Leave Type</label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as any)}
                  className="w-full bg-[#111319] border border-[#464554]/40 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                >
                  <option value="Annual Leave">Annual Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Bereavement">Bereavement</option>
                  <option value="Maternity">Maternity / Paternity</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Dates Range</label>
                <input
                  type="text"
                  value={manualDates}
                  onChange={(e) => setManualDates(e.target.value)}
                  placeholder="e.g. Nov 14 - Nov 16"
                  className="w-full bg-[#111319] border border-[#464554]/40 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>

              <div>
                <label className="block text-[#c0c1ff] font-semibold mb-1">Duration</label>
                <input
                  type="text"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  placeholder="e.g. 3 Days"
                  className="w-full bg-[#111319] border border-[#464554]/40 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#c0c1ff] font-semibold mb-1">Reason / Note to Manager</label>
              <input
                type="text"
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                placeholder="Brief reason for time off"
                className="w-full bg-[#111319] border border-[#464554]/40 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8083ff]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#8083ff] hover:bg-[#6f72ff] text-white font-semibold shadow-md shadow-[#8083ff]/30 transition-all"
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-bold text-white">Recent Requests & Approvals</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#464554]/30 text-[#908fa0] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Applicant</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Dates & Duration</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#464554]/20">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-[#282a30]/50 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-white">{req.employeeName}</td>
                  <td className="py-3.5 text-[#c0c1ff]">{req.type}</td>
                  <td className="py-3.5 text-[#e2e2eb]">{req.dates} ({req.duration})</td>
                  <td className="py-3.5 text-[#908fa0] italic">{req.reason}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : req.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-[#908fa0]">{req.appliedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
