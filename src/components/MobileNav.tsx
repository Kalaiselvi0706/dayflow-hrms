import React from 'react';
import { ScreenId, UserRole } from '../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentScreen,
  setCurrentScreen,
  userRole,
  setUserRole,
  onLogout,
}) => {
  if (!isOpen) return null;

  const navItems: { id: ScreenId; label: string; icon: string; isAI?: boolean }[] = [
    { id: 'employee_home', label: 'My Workspace', icon: 'grid_view' },
    { id: 'admin_dashboard', label: 'Admin Command', icon: 'space_dashboard' },
    { id: 'attendance_live', label: 'Live Attendance Pulse', icon: 'sensors' },
    { id: 'people_directory', label: 'People Directory', icon: 'groups' },
    { id: 'leave_hub', label: 'Leave & Time Off Hub', icon: 'calendar_month' },
    { id: 'employee_profile', label: 'Employee Profile', icon: 'badge' },
    { id: 'analytics', label: 'Executive Analytics', icon: 'insights' },
    { id: 'automations', label: 'Automation Center', icon: 'account_tree' },
    { id: 'ai_copilot', label: 'Nexora AI Copilot', icon: 'auto_awesome', isAI: true },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer panel */}
      <div className="relative w-80 max-w-[85vw] h-full bg-[#111319] border-r border-[#464554]/40 flex flex-col p-5 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#464554]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#03b5d3] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#111319] rounded-[7px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c0c1ff] text-base">all_inclusive</span>
              </div>
            </div>
            <span className="font-bold text-white text-base">NEXORA HR</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#908fa0] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User preview */}
        <div className="my-4 p-3 rounded-xl bg-[#1e1f26] border border-[#464554]/30 flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ"
            alt="Alex Rivers"
            className="w-10 h-10 rounded-full object-cover border border-[#8083ff]/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-sm font-semibold text-white">Alex Rivers</h4>
            <p className="text-xs text-[#908fa0]">{userRole === 'admin' ? 'HR Director' : 'Employee'}</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto space-y-1.5 py-2">
          {navItems
            .filter((item) => {
              if (userRole === 'employee') {
                return ['employee_home', 'attendance_live', 'leave_hub', 'employee_profile', 'ai_copilot'].includes(item.id);
              } else {
                return ['admin_dashboard', 'attendance_live', 'people_directory', 'leave_hub', 'employee_profile', 'analytics', 'automations', 'ai_copilot'].includes(item.id);
              }
            })
            .map((item) => (
              <button
              key={item.id}
              onClick={() => {
                setCurrentScreen(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentScreen === item.id
                  ? 'bg-[#282a30] text-[#c0c1ff] border border-[#8083ff]/40'
                  : 'text-[#908fa0] hover:text-white hover:bg-[#1e1f26]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Switch Role & Logout */}
        <div className="pt-4 border-t border-[#464554]/30 space-y-2">
          <button
            onClick={() => setUserRole(userRole === 'admin' ? 'employee' : 'admin')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-[#1e1f26] text-[#c0c1ff] border border-[#464554]/40"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            Switch to {userRole === 'admin' ? 'Employee Self-Service' : 'HR Admin Mode'}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
