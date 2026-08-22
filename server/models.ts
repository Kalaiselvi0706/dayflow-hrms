import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

// User Schema (Credentials and Roles)
export interface IUser extends MongooseDocument {
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  employeeId?: string; // Reference to Employee document
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], required: true },
  employeeId: { type: String },
}, { timestamps: true });

// Employee Schema
export interface ICareerTimeline {
  id: string;
  date: string;
  title: string;
  description: string;
  tag?: string;
}

export interface IEmployee extends MongooseDocument {
  code: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Sales' | 'HR' | 'Finance' | 'Product';
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  location: string;
  avatar?: string;
  joinDate: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
  leaveBalance: {
    total: number;
    available: number;
    used: number;
    pending: number;
  };
  careerTimeline: ICareerTimeline[];
}

const EmployeeSchema = new Schema<IEmployee>({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, required: true },
  department: { type: String, required: true, enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Product'] },
  status: { type: String, required: true, enum: ['Present', 'Late', 'Absent', 'On Leave'], default: 'Absent' },
  location: { type: String, required: true },
  avatar: { type: String, default: '' },
  joinDate: { type: String, required: true },
  type: { type: String, required: true, enum: ['Full Time', 'Part Time', 'Contract', 'Remote'], default: 'Full Time' },
  leaveBalance: {
    total: { type: Number, default: 20 },
    available: { type: Number, default: 20 },
    used: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  careerTimeline: [{
    id: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String }
  }]
}, { timestamps: true });

// Attendance Schema
export interface IAttendance extends MongooseDocument {
  employeeId?: string;
  employeeName: string;
  empCode: string;
  avatar?: string;
  department: string;
  status: 'Present' | 'Late' | 'Absent';
  time: string; // Clock-in time (e.g. "09:15 AM")
  date: string; // ISO date string (YYYY-MM-DD)
  checkoutTime?: string;
  duration?: string; // total hours worked (e.g. "8.2h")
}

const AttendanceSchema = new Schema<IAttendance>({
  employeeId: { type: String },
  employeeName: { type: String, required: true },
  empCode: { type: String, required: true, index: true },
  avatar: { type: String, default: '' },
  department: { type: String, required: true },
  status: { type: String, required: true, enum: ['Present', 'Late', 'Absent'] },
  time: { type: String, required: true },
  date: { type: String, required: true, index: true },
  checkoutTime: { type: String },
  duration: { type: String },
}, { timestamps: true });

// LeaveRequest Schema
export interface ILeaveRequest extends MongooseDocument {
  employeeName: string;
  empCode: string;
  avatar?: string;
  type: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Unpaid Leave';
  dates: string;
  duration: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedDate: string;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>({
  employeeName: { type: String, required: true },
  empCode: { type: String, required: true, index: true },
  avatar: { type: String, default: '' },
  type: { type: String, required: true, enum: ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'] },
  dates: { type: String, required: true },
  duration: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, required: true, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  appliedDate: { type: String, required: true },
}, { timestamps: true });

// Payroll Schema
export interface IPayroll extends MongooseDocument {
  employeeId: string;
  employeeName: string;
  empCode: string;
  baseSalary: string;
  currency: string;
  status: 'Paid' | 'Processing' | 'On Hold';
  payoutDate: string;
  payPeriod: string;
  equityAllocation?: string;
  benefitsPlan?: string;
}

const PayrollSchema = new Schema<IPayroll>({
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, required: true },
  empCode: { type: String, required: true },
  baseSalary: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, required: true, enum: ['Paid', 'Processing', 'On Hold'], default: 'Processing' },
  payoutDate: { type: String, required: true },
  payPeriod: { type: String, required: true },
  equityAllocation: { type: String },
  benefitsPlan: { type: String }
}, { timestamps: true });

// Document Schema
export interface IDocument extends MongooseDocument {
  title: string;
  category: string;
  uploadDate: string;
  size: string;
  url: string;
  employeeId?: string; // undefined means company-wide document
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  uploadDate: { type: String, required: true },
  size: { type: String, required: true },
  url: { type: String, required: true },
  employeeId: { type: String },
}, { timestamps: true });

// Notification Schema
export interface INotification extends MongooseDocument {
  employeeId: string; // 'all' means all users
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>({
  employeeId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// AuditLog Schema
export interface IAuditLog extends MongooseDocument {
  actor: string;
  action: string;
  details: string;
  timestamp: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actor: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: String, required: true },
}, { timestamps: true });

// AutomationRule Schema
export interface IAutomationRule extends MongooseDocument {
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

const AutomationRuleSchema = new Schema<IAutomationRule>({
  title: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
  triggerIcon: { type: String, required: true },
  triggerTitle: { type: String, required: true },
  conditionIcon: { type: String, required: true },
  conditionTitle: { type: String, required: true },
  actionIcon: { type: String, required: true },
  actionTitle: { type: String, required: true },
  runsCount: { type: Number, default: 0 },
  lastTriggered: { type: String, default: 'Never' },
}, { timestamps: true });

// Mongoose Models Exports
export const User = mongoose.model<IUser>('User', UserSchema);
export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);
export const Document = mongoose.model<IDocument>('Document', DocumentSchema);
export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const AutomationRule = mongoose.model<IAutomationRule>('AutomationRule', AutomationRuleSchema);
