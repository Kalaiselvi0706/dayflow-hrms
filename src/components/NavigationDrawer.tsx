import React from 'react';
import { ScreenId, UserRole } from '../types';

interface NavigationDrawerProps {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentScreen,
  setCurrentScreen,
  userRole,
  setUserRole,
  onLogout,
  unreadCount = 3,
}) => {
  const navItems: {
    id: ScreenId;
    label: string;
    icon: string;
    badge?: string | number;
    badgeColor?: string;
    isAI?: boolean;
    roleRequired?: UserRole;
  }[] = [
    {
      id: 'employee_home',
      label: 'My Workspace',
      icon: 'grid_view',
    },
    {
      id: 'admin_dashboard',
      label: 'Admin Command',
      icon: 'space_dashboard',
      badge: 'Live',
      badgeColor: 'bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40',
    },
    {
      id: 'attendance_live',
      label: 'Live Attendance',
      icon: 'sensors',
      badge: '98%',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    },
    {
      id: 'people_directory',
      label: 'People Directory',
      icon: 'groups',
      badge: 124,
      badgeColor: 'bg-[#282a30] text-[#908fa0]',
    },
    {
      id: 'leave_hub',
      label: 'Leave & Time Off',
      icon: 'calendar_month',
      badge: unreadCount > 0 ? `${unreadCount} new` : undefined,
      badgeColor: 'bg-[#a078ff]/20 text-[#d0bcff] border border-[#a078ff]/40',
    },
    {
      id: 'employee_profile',
      label: 'Employee Profile',
      icon: 'badge',
    },
    {
      id: 'analytics',
      label: 'Executive Analytics',
      icon: 'insights',
    },
    {
      id: 'automations',
      label: 'Automation Center',
      icon: 'account_tree',
      badge: '24 Active',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    },
    {
      id: 'ai_copilot',
      label: 'Nexora AI',
      icon: 'auto_awesome',
      isAI: true,
      badge: 'Gen-2',
      badgeColor: 'bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white font-semibold shadow-sm',
    },
  ];

  return (
    <aside
      id="main-navigation-drawer"
      className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-[#111319]/90 backdrop-blur-xl border-r border-[#464554]/30 z-30 select-none"
    >
      {/* Header / Brand */}
      <div className="p-6 pb-4 border-b border-[#464554]/20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('admin_dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#03b5d3] p-[2px] shadow-lg shadow-[#8083ff]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#111319] rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#c0c1ff] text-xl font-bold">all_inclusive</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">NEXORA</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8083ff]/20 text-[#c0c1ff] font-semibold border border-[#8083ff]/30 uppercase tracking-widest">
                HR
              </span>
            </div>
            <p className="text-[11px] text-[#908fa0] tracking-tight">Workforce Intelligence</p>
          </div>
        </div>
      </div>

      {/* User Card & Role Switcher */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-[#1e1f26]/70 border border-[#464554]/30 flex flex-col gap-2.5">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setCurrentScreen('employee_profile')}
        >
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ"
              alt="Alex Rivers"
              className="w-10 h-10 rounded-full object-cover border border-[#8083ff]/50"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111319]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">Alex Rivers</h4>
            <p className="text-xs text-[#908fa0] truncate">
              {userRole === 'admin' ? 'HR Director (Admin)' : 'HR Director (Self)'}
            </p>
          </div>
        </div>

        {/* Role toggle badge */}
        <div className="flex items-center justify-between pt-2 border-t border-[#464554]/20 text-xs">
          <span className="text-[#908fa0] font-medium">Viewing Mode:</span>
          <button
            id="role-switch-button"
            onClick={() => setUserRole(userRole === 'admin' ? 'employee' : 'admin')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#282a30] hover:bg-[#33343b] text-[#c0c1ff] font-medium transition-all text-[11px] border border-[#464554]/40"
          >
            <span className="material-symbols-outlined text-xs">
              {userRole === 'admin' ? 'admin_panel_settings' : 'badge'}
            </span>
            {userRole === 'admin' ? 'Admin Mode' : 'Employee Mode'}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        <div className="text-[10px] font-semibold text-[#908fa0] uppercase tracking-wider px-3 mb-2">
          Navigation
        </div>
        {navItems
          .filter((item) => {
            if (userRole === 'employee') {
              return ['employee_home', 'attendance_live', 'leave_hub', 'employee_profile', 'ai_copilot'].includes(item.id);
            } else {
              return ['admin_dashboard', 'attendance_live', 'people_directory', 'leave_hub', 'employee_profile', 'analytics', 'automations', 'ai_copilot'].includes(item.id);
            }
          })
          .map((item) => {
            const isActive = currentScreen === item.id;
            return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? item.isAI
                    ? 'bg-gradient-to-r from-[#8083ff]/30 to-[#a078ff]/30 text-white border border-[#a078ff]/50 shadow-md shadow-[#8083ff]/10'
                    : 'bg-[#282a30] text-[#c0c1ff] border border-[#8083ff]/40 shadow-sm'
                  : item.isAI
                  ? 'text-[#d0bcff] hover:bg-[#1e1f26] border border-[#a078ff]/20'
                  : 'text-[#908fa0] hover:text-[#e2e2eb] hover:bg-[#1e1f26]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${
                    isActive
                      ? item.isAI
                        ? 'text-[#d0bcff]'
                        : 'text-[#c0c1ff]'
                      : item.isAI
                      ? 'text-[#a078ff]'
                      : 'text-[#908fa0] group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium tracking-tight ${
                    item.badgeColor || 'bg-[#282a30] text-[#908fa0]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-[#464554]/20 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#908fa0] px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Model Online</span>
          </div>
          <span className="text-[11px] text-[#908fa0]">v2.4.0</span>
        </div>

        <button
          id="logout-button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-[#908fa0] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};
