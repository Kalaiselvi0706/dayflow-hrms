import React from 'react';
import { ScreenId, UserRole } from '../types';

interface AppHeaderProps {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenQuickAI?: () => void;
  notificationCount?: number;
  onOpenMobileMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentScreen,
  setCurrentScreen,
  userRole,
  setUserRole,
  onOpenQuickAI,
  notificationCount = 3,
  onOpenMobileMenu,
}) => {
  const getScreenTitle = (screen: ScreenId) => {
    switch (screen) {
      case 'employee_home':
        return { title: 'Employee Workspace', subtitle: 'Personal overview & daily attendance check-in' };
      case 'admin_dashboard':
        return { title: 'Admin Command Center', subtitle: 'Workforce intelligence, attendance pulse & actions' };
      case 'attendance_live':
        return { title: 'Live Attendance Pulse', subtitle: 'Real-time telemetry, waveform & shift verification' };
      case 'people_directory':
        return { title: 'People Directory', subtitle: 'Complete organization directory with AI onboarding' };
      case 'employee_profile':
        return { title: 'Employee Profile', subtitle: 'Executive dossier, career timeline & AI retention analysis' };
      case 'leave_hub':
        return { title: 'Leave & Time Off Hub', subtitle: 'AI Leave Assistant & balance reconciliation' };
      case 'analytics':
        return { title: 'Executive Analytics', subtitle: 'Predictive retention, department radar & productivity curves' };
      case 'automations':
        return { title: 'Automation Center', subtitle: 'Intelligent rule engine & predictive HR workflows' };
      case 'ai_copilot':
        return { title: 'Nexora AI Copilot', subtitle: 'Conversational HR analytics & automated workflows' };
      default:
        return { title: 'Nexora HR', subtitle: 'Workforce Intelligence' };
    }
  };

  const { title, subtitle } = getScreenTitle(currentScreen);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#111319]/80 backdrop-blur-md border-b border-[#464554]/30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#908fa0] hover:text-white hover:bg-[#1e1f26]"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h1>
            {currentScreen === 'admin_dashboard' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Sync
              </span>
            )}
          </div>
          <p className="hidden md:block text-xs text-[#908fa0]">{subtitle}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Screen Jumper */}
        <div className="relative">
          <select
            id="quick-screen-select"
            value={currentScreen}
            onChange={(e) => setCurrentScreen(e.target.value as ScreenId)}
            className="appearance-none bg-[#1e1f26] text-xs font-medium text-[#c0c1ff] border border-[#464554]/40 rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-[#8083ff] cursor-pointer"
          >
            {userRole === 'employee' ? (
              <>
                <option value="employee_home">📱 Employee Workspace</option>
                <option value="attendance_live">⚡ Live Attendance Pulse</option>
                <option value="leave_hub">🏖️ Leave Hub & AI Assistant</option>
                <option value="employee_profile">👤 Employee Dossier</option>
                <option value="ai_copilot">✨ Nexora AI Copilot</option>
              </>
            ) : (
              <>
                <option value="admin_dashboard">📊 Admin Command Center</option>
                <option value="attendance_live">⚡ Live Attendance Pulse</option>
                <option value="people_directory">👥 People Directory</option>
                <option value="leave_hub">🏖️ Leave Hub & AI Assistant</option>
                <option value="employee_profile">👤 Employee Dossier</option>
                <option value="analytics">📈 Executive Analytics</option>
                <option value="automations">⚡ Automation Workflows</option>
                <option value="ai_copilot">✨ Nexora AI Copilot</option>
              </>
            )}
          </select>
          <span className="material-symbols-outlined text-xs text-[#908fa0] absolute right-2.5 top-2.5 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Nexora AI Quick Assistant Button */}
        <button
          id="header-open-ai-button"
          onClick={() => setCurrentScreen('ai_copilot')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8083ff]/20 to-[#a078ff]/20 text-[#d0bcff] hover:text-white border border-[#a078ff]/40 shadow-sm text-xs font-medium transition-all hover:scale-105"
        >
          <span className="material-symbols-outlined text-sm text-[#c0c1ff]">auto_awesome</span>
          <span className="hidden sm:inline">Ask Nexora AI</span>
        </button>

        {/* Notifications */}
        <button
          id="header-notification-button"
          onClick={() => setCurrentScreen('admin_dashboard')}
          className="relative p-2 rounded-xl text-[#908fa0] hover:text-white hover:bg-[#1e1f26] border border-transparent hover:border-[#464554]/30 transition-all"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8083ff] ring-2 ring-[#111319]"></span>
          )}
        </button>

        {/* User Mini Avatar */}
        <button
          onClick={() => setCurrentScreen('employee_profile')}
          className="w-8 h-8 rounded-full border border-[#8083ff]/40 overflow-hidden ring-1 ring-[#8083ff]/20 hover:ring-[#8083ff] transition-all"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ"
            alt="Alex Rivers"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};
