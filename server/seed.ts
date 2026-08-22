import { hashPassword } from './auth';
import { User, Employee, Attendance, LeaveRequest, Payroll, Document, Notification, AuditLog, AutomationRule } from './models';
import mongoose from 'mongoose';

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping seed.');
      return;
    }

    console.log('Seeding database with demo workforce datasets...');

    // Clear collections first
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Payroll.deleteMany({}),
      Document.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      AutomationRule.deleteMany({}),
    ]);

    // Create Employee record for Alex Rivers
    const employeeAlex = await Employee.create({
      code: 'NX-2490',
      name: 'Alex Rivers',
      email: 'employee@nexora.internal',
      phone: '+1 (555) 234-5678',
      role: 'Staff Product Designer',
      department: 'Design',
      status: 'Present',
      location: 'San Francisco, CA',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoN3FD_QRBjTCVNpEsrYn9FEjWkdRvDBsnb9l-rlyRp-jYtyBsi0Ze1pCmUxkA2kbMbo5IOUU_Sy-mahmf8UfzKnpQPcmihZ_y7L_AfHDNiNYMaXOCiofRrR6TaNLBUDwNmhkjCb2dzrjMR95jUbXvWyFneWAkPD8OxgsZaddTeNv7UmmETrWE1UXLsEDoIdGrSGO502SGozPkrzD6zYKFGMgvz35rIGtvGVrEGIlB9ZU5LnG8YutYeQ',
      joinDate: 'Jan 15, 2022',
      type: 'Full Time',
      leaveBalance: {
        total: 20,
        available: 14,
        used: 4,
        pending: 2,
      },
      careerTimeline: [
        {
          id: 'timeline-1',
          date: 'Jan 15, 2022',
          title: 'Joined Nexora HR',
          description: 'Onboarded as Senior Product Designer at SF Innovation Hub.',
          tag: 'Onboarding'
        },
        {
          id: 'timeline-2',
          date: 'Nov 10, 2023',
          title: 'Promoted to Staff Designer',
          description: 'Recognized for leading the system-wide Stitch UI design architecture.',
          tag: 'Promotion'
        }
      ]
    });

    // Create additional employees
    const employeeJordan = await Employee.create({
      code: 'NX-8081',
      name: 'Jordan Vance',
      email: 'jordan.vance@nexora.internal',
      phone: '+1 (555) 723-9081',
      role: 'Staff Infrastructure Engineer',
      department: 'Engineering',
      status: 'Present',
      location: 'San Francisco, CA',
      joinDate: 'Mar 12, 2021',
      type: 'Full Time',
      leaveBalance: { total: 20, available: 20, used: 0, pending: 0 },
      careerTimeline: [
        { id: 't-j-1', date: 'Mar 12, 2021', title: 'Joined Infrastructure', description: 'Assumed site reliability operations leadership.' }
      ]
    });

    const employeeSarah = await Employee.create({
      code: 'NX-3029',
      name: 'Sarah Connor',
      email: 'sarah.connor@nexora.internal',
      phone: '+1 (555) 912-3029',
      role: 'HR Lead Specialist',
      department: 'HR',
      status: 'On Leave',
      location: 'Austin, TX',
      joinDate: 'Oct 01, 2020',
      type: 'Full Time',
      leaveBalance: { total: 25, available: 15, used: 8, pending: 2 },
      careerTimeline: [
        { id: 't-s-1', date: 'Oct 01, 2020', title: 'Joined Talent Team', description: 'Tasked with scale onboarding systems.' }
      ]
    });

    // Hash Passwords
    const employeePass = await hashPassword('password');
    const adminPass = await hashPassword('password');

    // Create Users
    await User.create([
      {
        email: 'employee@nexora.internal',
        passwordHash: employeePass,
        role: 'employee',
        employeeId: employeeAlex.id,
      },
      {
        email: 'hr@nexora.internal',
        passwordHash: adminPass,
        role: 'admin',
      }
    ]);

    // Create initial Attendance logs
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    await Attendance.create([
      {
        employeeId: employeeAlex.id,
        employeeName: employeeAlex.name,
        empCode: employeeAlex.code,
        avatar: employeeAlex.avatar,
        department: employeeAlex.department,
        status: 'Present',
        time: '08:58 AM',
        date: yesterday,
        checkoutTime: '05:30 PM',
        duration: '8.5h'
      },
      {
        employeeId: employeeAlex.id,
        employeeName: employeeAlex.name,
        empCode: employeeAlex.code,
        avatar: employeeAlex.avatar,
        department: employeeAlex.department,
        status: 'Present',
        time: '09:05 AM',
        date: today
      },
      {
        employeeId: employeeJordan.id,
        employeeName: employeeJordan.name,
        empCode: employeeJordan.code,
        department: employeeJordan.department,
        status: 'Present',
        time: '08:45 AM',
        date: today
      }
    ]);

    // Create initial LeaveRequests
    await LeaveRequest.create([
      {
        employeeName: employeeAlex.name,
        empCode: employeeAlex.code,
        avatar: employeeAlex.avatar,
        type: 'Annual Leave',
        dates: 'Nov 14 - Nov 16',
        duration: '3 Days',
        reason: 'Family gathering in New York',
        status: 'Pending',
        appliedDate: 'Yesterday'
      },
      {
        employeeName: 'Sarah Connor',
        empCode: 'NX-3029',
        type: 'Sick Leave',
        dates: 'Oct 02 - Oct 03',
        duration: '2 Days',
        reason: 'Medical checkup and procedure recovery',
        status: 'Approved',
        appliedDate: 'Oct 01, 2024'
      }
    ]);

    // Create initial Payroll records
    await Payroll.create([
      {
        employeeId: employeeAlex.id,
        employeeName: employeeAlex.name,
        empCode: employeeAlex.code,
        baseSalary: '185,000',
        currency: 'USD',
        status: 'Paid',
        payoutDate: 'Aug 15, 2026',
        payPeriod: 'Aug 1 - Aug 15',
        equityAllocation: '45,000 RSUs',
        benefitsPlan: 'Platinum Plan'
      },
      {
        employeeId: employeeJordan.id,
        employeeName: employeeJordan.name,
        empCode: employeeJordan.code,
        baseSalary: '190,000',
        currency: 'USD',
        status: 'Processing',
        payoutDate: 'Aug 30, 2026',
        payPeriod: 'Aug 15 - Aug 30',
        equityAllocation: '60,000 RSUs',
        benefitsPlan: 'Platinum Gold'
      }
    ]);

    // Create initial Documents
    await Document.create([
      {
        title: '2026 Q3 Benefit Coverage Guide.pdf',
        category: 'Benefits',
        uploadDate: 'Aug 10, 2026',
        size: '2.4 MB',
        url: '#'
      },
      {
        title: 'Nexora Employee Handbook v2.pdf',
        category: 'Compliance',
        uploadDate: 'Jan 05, 2026',
        size: '4.8 MB',
        url: '#'
      },
      {
        title: 'Alex_Rivers_W2_2025.pdf',
        category: 'Tax Documents',
        uploadDate: 'Jan 31, 2026',
        size: '345 KB',
        url: '#',
        employeeId: employeeAlex.id
      }
    ]);

    // Create initial Notifications
    await Notification.create([
      {
        employeeId: 'all',
        title: 'System Maintenance Window',
        message: 'The Nexora smart portal will experience a 10-minute AI pipeline optimization check tonight at 12:00 AM UTC.',
        date: '2 hours ago',
        read: false
      },
      {
        employeeId: employeeAlex.id,
        title: 'Leave Request Received',
        message: 'Your request for Annual Leave (Nov 14 - Nov 16) has been queued for autonomous manager approval.',
        date: 'Yesterday',
        read: true
      }
    ]);

    // Create initial Audit Logs
    await AuditLog.create([
      {
        actor: 'HR Autonomous Daemon',
        action: 'AUTO_RESOLVED_CONFLICT',
        details: 'Leave overlap resolution triggered. Verified Engineering capacity at 94% threshold.',
        timestamp: 'Just now'
      },
      {
        actor: 'System Admin',
        action: 'SECURITY_PATCH_DEPLOY',
        details: 'Configured role protection routing rules and encrypted credential pools.',
        timestamp: '1 hour ago'
      }
    ]);

    // Create initial AutomationRules
    await AutomationRule.create([
      {
        title: 'Onboarding Slack Welcome Ping',
        status: 'Active',
        triggerIcon: 'bolt',
        triggerTitle: 'New Hire Added',
        conditionIcon: 'psychology',
        conditionTitle: 'Department == Any',
        actionIcon: 'send',
        actionTitle: 'Send Welcome Slack & Provision Okta Account',
        runsCount: 14,
        lastTriggered: '2 days ago'
      },
      {
        title: 'PTO Smart Congruence Check',
        status: 'Active',
        triggerIcon: 'auto_awesome',
        triggerTitle: 'Leave Request Submitted',
        conditionIcon: 'psychology',
        conditionTitle: 'Team Capacity >= 85%',
        actionIcon: 'done_all',
        actionTitle: 'Auto-Approve PTO Request & Sync Calendar',
        runsCount: 38,
        lastTriggered: 'Yesterday'
      }
    ]);

    console.log('Database successfully seeded.');
  } catch (err: any) {
    console.error('Database seeding failed:', err.message);
  }
}
