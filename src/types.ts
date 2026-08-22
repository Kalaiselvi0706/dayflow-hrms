export type UserRole = 'admin' | 'employee';

export type ScreenId =
  | 'auth'
  | 'employee_home'
  | 'admin_dashboard'
  | 'attendance_live'
  | 'people_directory'
  | 'employee_profile'
  | 'leave_hub'
  | 'analytics'
  | 'automations'
  | 'ai_copilot';

export interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Sales' | 'Finance' | 'Product' | 'Operations' | 'HR';
  status: 'Present' | 'Late' | 'On Leave' | 'Absent';
  location: string;
  avatar: string;
  joinDate: string;
  type: 'Full Time' | 'Contract' | 'Part Time';
  retentionRate?: number;
  leaveBalance: {
    total: number;
    available: number;
    used: number;
    pending: number;
  };
  careerTimeline: {
    id: string;
    date: string;
    title: string;
    description: string;
    tag?: string;
    isPromotion?: boolean;
  }[];
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  empCode: string;
  avatar: string;
  department: string;
  status: 'Present' | 'Late' | 'On Leave' | 'Absent';
  time: string;
  duration?: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  avatar: string;
  empCode: string;
  type: 'Paid Leave' | 'Sick Leave' | 'Annual Leave' | 'Bereavement' | 'Maternity' | 'Unpaid';
  dates: string;
  duration: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedDate: string;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  status: 'Active' | 'Paused';
  triggerIcon: string;
  triggerTitle: string;
  conditionIcon: string;
  conditionTitle: string;
  actionIcon: string;
  actionTitle: string;
  runsCount: number;
  lastTriggered: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  widget?: {
    type: 'availability_absence' | 'leave_summary' | 'burnout_alert';
    data?: any;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  employeeId?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  empCode: string;
  department: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Processing' | 'On Hold';
  paymentDate?: string;
}

export interface Document {
  id: string;
  employeeId?: string;
  employeeName?: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  category: 'Resume' | 'Contract' | 'Policy' | 'Tax' | 'ID Proof' | 'Other';
  status: 'Verified' | 'Pending' | 'Rejected';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

