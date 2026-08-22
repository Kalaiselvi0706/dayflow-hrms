import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/Layout';

// Existing Screens
import { AuthScreen } from '../screens/AuthScreen';
import { EmployeeDashboardScreen } from '../screens/EmployeeDashboardScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { LiveAttendanceScreen } from '../screens/LiveAttendanceScreen';
import { PeopleDirectoryScreen } from '../screens/PeopleDirectoryScreen';
import { EmployeeProfileScreen } from '../screens/EmployeeProfileScreen';
import { LeaveHubScreen } from '../screens/LeaveHubScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { AutomationsScreen } from '../screens/AutomationsScreen';
import { AICopilotScreen } from '../screens/AICopilotScreen';

// New Screens
import { PayrollScreen } from '../screens/PayrollScreen';
import { PayrollManagementScreen } from '../screens/PayrollManagementScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { AdminDocumentsScreen } from '../screens/AdminDocumentsScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ActionsScreen } from '../screens/ActionsScreen';
import { AuditTrailScreen } from '../screens/AuditTrailScreen';
import { AdminSettingsScreen } from '../screens/AdminSettingsScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthScreen />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Default Routing Redirects */}
          <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboardScreen />} />
          <Route path="/employee/profile" element={<EmployeeProfileScreen />} />
          <Route path="/employee/attendance" element={<LiveAttendanceScreen />} />
          <Route path="/employee/leave" element={<LeaveHubScreen />} />
          <Route path="/employee/payroll" element={<PayrollScreen />} />
          <Route path="/employee/documents" element={<DocumentsScreen />} />
          <Route path="/employee/timeline" element={<TimelineScreen />} />
          <Route path="/employee/notifications" element={<NotificationsScreen />} />
          <Route path="/employee/ai" element={<AICopilotScreen />} />

          {/* Admin / HR Routes */}
          <Route element={<ProtectedRoute roleRequired="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
            <Route path="/admin/employees" element={<PeopleDirectoryScreen />} />
            <Route path="/admin/employees/:id" element={<EmployeeProfileScreen />} />
            <Route path="/admin/attendance" element={<LiveAttendanceScreen />} />
            <Route path="/admin/leave" element={<LeaveHubScreen />} />
            <Route path="/admin/payroll" element={<PayrollManagementScreen />} />
            <Route path="/admin/reports" element={<ReportsScreen />} />
            <Route path="/admin/documents" element={<AdminDocumentsScreen />} />
            <Route path="/admin/calendar" element={<CalendarScreen />} />
            <Route path="/admin/analytics" element={<AnalyticsScreen />} />
            <Route path="/admin/actions" element={<ActionsScreen />} />
            <Route path="/admin/automations" element={<AutomationsScreen />} />
            <Route path="/admin/insights" element={<AnalyticsScreen />} /> {/* Alias to Analytics */}
            <Route path="/admin/ai" element={<AICopilotScreen />} />
            <Route path="/admin/audit" element={<AuditTrailScreen />} />
            <Route path="/admin/settings" element={<AdminSettingsScreen />} />
          </Route>
        </Route>
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
export default AppRoutes;
