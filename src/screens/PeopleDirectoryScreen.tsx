import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { NotificationToast } from '../components/common/NotificationToast';

export const PeopleDirectoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isParsingResume, setIsParsingResume] = useState(false);

  // Form State for new employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering' as Employee['department'],
    location: 'San Francisco, CA',
    type: 'Full Time' as Employee['type'],
    salary: '145,000',
    currency: 'USD',
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchQuery =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchQuery && matchDept;
  });

  const handleSimulateResumeUpload = () => {
    setIsParsingResume(true);
    setTimeout(() => {
      setFormData({
        name: 'Jordan Vance',
        email: 'jordan.vance@nexora.internal',
        phone: '+1 (555) 723-9081',
        role: 'Staff Infrastructure Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full Time',
        salary: '185,000',
        currency: 'USD',
      });
      setIsParsingResume(false);
    }, 1200);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await employeeService.addEmployee(formData);
      setEmployees((prev) => [added, ...prev]);
      setIsDrawerOpen(false);
      setCurrentStep(1);
      setToastMessage(`Onboarded ${added.name} successfully!`);
      setTimeout(() => {
        navigate(`/admin/employees/${added.id}`);
      }, 1000);
    } catch (err) {
      setToastMessage('Onboarding failed.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonLoader variant="card" count={1} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
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

      {/* Top Banner */}
      <div className="rounded-3xl bg-[#1e1f26]/80 border border-[#464554]/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8083ff]">
              Organization & Talent Roster
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            People Directory
          </h2>
          <p className="text-sm text-[#908fa0] max-w-xl">
            Unified directory covering team structures, compensation records, and career timeline milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="add-employee-btn"
            onClick={() => setIsDrawerOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white text-xs font-semibold shadow-lg shadow-[#8083ff]/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Add New Employee
          </button>
        </div>
      </div>

      {/* Department Summary Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Product'].map((dept) => {
          const count =
            dept === 'All' ? employees.length : employees.filter((e) => e.department === dept).length;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedDept === dept
                  ? 'bg-[#8083ff] text-white shadow-md shadow-[#8083ff]/20'
                  : 'bg-[#1e1f26] text-[#908fa0] hover:text-white border border-[#464554]/30'
              }`}
            >
              <span>{dept}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedDept === dept ? 'bg-white/20' : 'bg-[#282a30]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-sm text-[#908fa0]">search</span>
            <input
              type="text"
              placeholder="Search by name, role, employee code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-[#908fa0]/60 focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <span className="text-xs text-[#908fa0]">
            Showing <strong className="text-white">{filteredEmployees.length}</strong> personnel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => {
                navigate(`/admin/employees/${emp.id}`);
              }}
              className="rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 p-5 sm:p-6 backdrop-blur-xl hover:border-[#8083ff]/60 hover:bg-[#282a30]/80 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {emp.avatar ? (
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#8083ff]/40 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8083ff]/30 to-[#4cd7f6]/30 text-[#c0c1ff] flex items-center justify-center font-bold text-lg border border-[#8083ff]/30">
                      {emp.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#c0c1ff] transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-[#908fa0]">{emp.role}</p>
                    <span className="text-[10px] font-mono text-[#8083ff]">{emp.code}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    emp.status === 'Present'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : emp.status === 'Late'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : emp.status === 'On Leave'
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="pt-3 border-t border-[#464554]/20 grid grid-cols-2 gap-2 text-xs text-[#908fa0]">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-[#908fa0]">Department</span>
                  <span className="text-white font-medium">{emp.department}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-[#908fa0]">Location</span>
                  <span className="text-white font-medium truncate">{emp.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#908fa0] text-[11px]">Joined {emp.joinDate}</span>
                <span className="text-[#8083ff] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-xs">
                  View Dossier →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Step Add Employee Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>

          <div className="relative w-full max-w-xl h-full bg-[#111319] border-l border-[#464554]/40 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#464554]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#03b5d3] p-[1.5px] flex items-center justify-center">
                    <div className="w-full h-full bg-[#111319] rounded-[9px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#c0c1ff]">person_add</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Onboard New Team Member</h3>
                    <p className="text-xs text-[#908fa0]">Step {currentStep} of 3</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-[#908fa0] hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Progress Steps */}
              <div className="my-6 grid grid-cols-3 gap-2">
                {[
                  { step: 1, label: 'Identity & AI Ingest' },
                  { step: 2, label: 'Role & Department' },
                  { step: 3, label: 'Payroll & Sign-off' },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      currentStep === s.step
                        ? 'bg-[#8083ff]/20 border-[#8083ff] text-white'
                        : currentStep > s.step
                        ? 'bg-[#282a30] border-emerald-500/40 text-emerald-300'
                        : 'bg-[#1e1f26] border-[#464554]/30 text-[#908fa0]'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">STEP {s.step}</span>
                    <span className="text-[11px] truncate block">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Step 1: AI Resume Ingest + Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* AI Resume Dropzone */}
                  <div
                    onClick={handleSimulateResumeUpload}
                    className="p-5 rounded-2xl border-2 border-dashed border-[#8083ff]/50 bg-[#1e1f26]/60 hover:bg-[#1e1f26] text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Quick Ingest (Resume / CV)</h4>
                      <p className="text-[11px] text-[#908fa0]">
                        Click to auto-fill identity from PDF or resume scan
                      </p>
                    </div>
                    {isParsingResume && (
                      <div className="text-xs text-[#8083ff] font-semibold animate-pulse flex items-center justify-center gap-1">
                        <span className="w-3 h-3 border-2 border-[#8083ff] border-t-transparent rounded-full animate-spin"></span>
                        Nexora AI parsing candidate credentials...
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Vance"
                      className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Work Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jordan.v@nexora.internal"
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Role & Department */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Designation / Role Title</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Staff Infrastructure Engineer"
                      className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Location Hub</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      >
                        <option value="San Francisco, CA">San Francisco, CA</option>
                        <option value="New York, NY">New York, NY</option>
                        <option value="Austin, TX">Austin, TX</option>
                        <option value="London, UK">London, UK</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Compensation & Final Approval */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Base Annual Salary</label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#c0c1ff] mb-1">Employment Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full bg-[#1e1f26] border border-[#464554]/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8083ff]"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Part Time">Part Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1e1f26] border border-emerald-500/40 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Ready for Automated Onboarding</span>
                    </div>
                    <p className="text-[#908fa0]">
                      Upon submission, Nexora HR will generate Okta SSO credentials, Slack workspace access, and initial payroll accounts.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Step Controls */}
            <div className="pt-6 border-t border-[#464554]/30 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#908fa0] hover:text-white"
                >
                  ← Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2 rounded-xl bg-[#8083ff] text-white text-xs font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#03b5d3] text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Complete Onboarding
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
