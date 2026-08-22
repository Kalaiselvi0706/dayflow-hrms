import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShaderBackground } from './ShaderBackground';
import { NavigationDrawer } from './NavigationDrawer';
import { MobileNav } from './MobileNav';
import { AppHeader } from './AppHeader';
import { ScreenId } from '../types';
import { leaveService } from '../services/leaveService';

export const Layout: React.FC = () => {
  const { userRole, setUserRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Load unread count from leave service
  useEffect(() => {
    const loadPending = async () => {
      try {
        const reqs = await leaveService.getLeaveRequests();
        setPendingLeaveCount(reqs.filter((r) => r.status === 'Pending').length);
      } catch (err) {}
    };
    loadPending();
  }, [location.pathname]);

  // Determine currentScreen key based on pathname
  const getCurrentScreen = (path: string): ScreenId => {
    if (path.startsWith('/employee/dashboard')) return 'employee_home';
    if (path.startsWith('/admin/dashboard')) return 'admin_dashboard';
    if (path.startsWith('/admin/attendance') || path.startsWith('/employee/attendance')) return 'attendance_live';
    if (path.startsWith('/admin/employees')) return 'people_directory';
    if (path.startsWith('/admin/leave') || path.startsWith('/employee/leave')) return 'leave_hub';
    if (path.startsWith('/admin/employees/') || path.startsWith('/employee/profile')) return 'employee_profile';
    if (path.startsWith('/admin/analytics')) return 'analytics';
    if (path.startsWith('/admin/automations')) return 'automations';
    if (path.startsWith('/admin/ai') || path.startsWith('/employee/ai')) return 'ai_copilot';
    return 'admin_dashboard';
  };

  const currentScreen = getCurrentScreen(location.pathname);

  const handleSetCurrentScreen = (screen: ScreenId) => {
    const rolePrefix = userRole === 'admin' ? '/admin' : '/employee';
    switch (screen) {
      case 'employee_home':
        navigate('/employee/dashboard');
        break;
      case 'admin_dashboard':
        navigate('/admin/dashboard');
        break;
      case 'attendance_live':
        navigate(`${rolePrefix}/attendance`);
        break;
      case 'people_directory':
        navigate('/admin/employees');
        break;
      case 'leave_hub':
        navigate(`${rolePrefix}/leave`);
        break;
      case 'employee_profile':
        navigate(userRole === 'admin' ? '/admin/employees/emp-1' : '/employee/profile');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      case 'automations':
        navigate('/admin/automations');
        break;
      case 'ai_copilot':
        navigate(`${rolePrefix}/ai`);
        break;
      default:
        navigate(`${rolePrefix}/dashboard`);
    }
  };

  const handleToggleRole = (role: 'admin' | 'employee') => {
    setUserRole(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111319] text-[#e2e2eb] selection:bg-[#8083ff] selection:text-white flex overflow-hidden w-full">
      {/* Background WebGL Shader */}
      <ShaderBackground opacity={0.8} />

      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <NavigationDrawer
          currentScreen={currentScreen}
          setCurrentScreen={handleSetCurrentScreen}
          userRole={userRole}
          setUserRole={handleToggleRole}
          onLogout={logout}
          unreadCount={pendingLeaveCount}
        />

        {/* Mobile Sidebar */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          currentScreen={currentScreen}
          setCurrentScreen={handleSetCurrentScreen}
          userRole={userRole}
          setUserRole={handleToggleRole}
          onLogout={logout}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
          <AppHeader
            currentScreen={currentScreen}
            setCurrentScreen={handleSetCurrentScreen}
            userRole={userRole}
            setUserRole={handleToggleRole}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            notificationCount={pendingLeaveCount}
          />

          <main className="flex-1 pb-16">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
