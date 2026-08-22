import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthScreen: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex.rivers@nexora.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      // Determine dashboard redirection based on the saved user role
      const savedRole = localStorage.getItem('nexora_role');
      navigate(savedRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    const demoEmail = role === 'admin' ? 'hr@nexora.internal' : 'employee@nexora.internal';
    const success = await login(demoEmail, 'password');
    setIsSubmitting(false);
    if (success) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    }
  };


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Centered Glass Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Glow ambient circle */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#8083ff]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#03b5d3]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative bg-[#1a1d26]/80 backdrop-blur-2xl border border-[#464554]/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80">
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#03b5d3] p-[2px] shadow-lg shadow-[#8083ff]/30 mb-2">
              <div className="w-full h-full bg-[#111319] rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl font-bold">all_inclusive</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">NEXORA HR</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] font-semibold border border-[#8083ff]/40 uppercase tracking-wider">
                Enterprise
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#908fa0] max-w-md mx-auto leading-relaxed">
              The intelligence behind your workforce. Autonomous HR operations, predictive attendance, and cognitive talent insights.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider mb-2">
                Workplace Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-lg text-[#908fa0]">mail</span>
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-10 py-2.5 text-sm text-white placeholder-[#908fa0]/50 focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider">
                  Enterprise Password
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-[#8083ff] hover:underline">
                  Forgot key?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-lg text-[#908fa0]">lock</span>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111319]/90 border border-[#464554]/50 rounded-xl px-10 py-2.5 text-sm text-white placeholder-[#908fa0]/50 focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#908fa0] hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#908fa0] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="rounded bg-[#111319] border-[#464554] text-[#8083ff] focus:ring-0" />
                <span>Keep session active</span>
              </label>
              <span className="text-[#8083ff] cursor-pointer hover:underline">SSO with Okta / Google</span>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8083ff] via-[#6f72ff] to-[#a078ff] text-white font-semibold text-sm shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating Neural Credential...</span>
                </>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-[#464554]/30">
            <div className="text-center text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-3">
              Instant Demo Access
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="demo-admin-login"
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-medium border border-[#464554]/50 transition-all hover:border-[#8083ff]/60"
              >
                <span className="material-symbols-outlined text-sm text-[#8083ff]">admin_panel_settings</span>
                <span>HR Director (Admin)</span>
              </button>
              <button
                id="demo-employee-login"
                type="button"
                onClick={() => handleDemoLogin('employee')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-white text-xs font-medium border border-[#464554]/50 transition-all hover:border-[#4cd7f6]/60"
              >
                <span className="material-symbols-outlined text-sm text-[#4cd7f6]">person</span>
                <span>Employee View</span>
              </button>
            </div>
          </div>

          {/* Connected Lifecycle Nodes */}
          <div className="mt-8 pt-6 border-t border-[#464554]/20 flex items-center justify-between text-center px-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span className="text-[11px] text-[#908fa0]">Neural Sync</span>
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500/40 to-[#8083ff]/40 mx-2"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40 flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <span className="text-[11px] text-[#908fa0]">Cognitive HR</span>
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#8083ff]/40 to-[#03b5d3]/40 mx-2"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span className="text-[11px] text-[#908fa0]">Autonomous</span>
            </div>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#908fa0]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-emerald-400">verified_user</span>
            SOC2 Type II Certified
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-[#8083ff]">lock</span>
            256-bit Encryption
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-[#4cd7f6]">shield</span>
            GDPR Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
