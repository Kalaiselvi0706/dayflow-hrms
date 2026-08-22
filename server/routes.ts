import { Router, Response } from 'express';
import { AuthRequest, authenticateToken, hashPassword, comparePassword, generateToken } from './auth';
import { User, Employee, Attendance, LeaveRequest, Payroll, Document as DocModel, Notification, AuditLog, AutomationRule } from './models';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// ----------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const employee = user.employeeId ? await Employee.findById(user.employeeId) : null;
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee: employee || undefined
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  const { email, password, role, name, department, location } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const passwordHash = await hashPassword(password);
    let employeeId: string | undefined;

    if (role === 'employee') {
      const newEmp = await Employee.create({
        code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name || 'New Employee',
        email,
        department: department || 'Engineering',
        status: 'Absent',
        location: location || 'San Francisco, CA',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'Full Time',
        leaveBalance: { total: 20, available: 20, used: 0, pending: 0 },
        careerTimeline: [{
          id: `c-${Date.now()}`,
          date: 'Today',
          title: 'Joined as Employee',
          description: 'Created account and onboarded to smart portal.'
        }]
      });
      employeeId = newEmp.id;

      // Seed default payroll for employee
      await Payroll.create({
        employeeId: newEmp.id,
        employeeName: newEmp.name,
        empCode: newEmp.code,
        baseSalary: '120,000',
        status: 'Processing',
        payoutDate: 'Next cycle',
        payPeriod: 'Semi-monthly'
      });
    }

    const newUser = await User.create({
      email,
      passwordHash,
      role: role || 'employee',
      employeeId
    });

    res.status(21).json({ message: 'User registered successfully.', user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const employee = user.employeeId ? await Employee.findById(user.employeeId) : null;
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      employee: employee || undefined
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout
router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// ----------------------------------------------------
// EMPLOYEES APIs
// ----------------------------------------------------

// GET /api/employees
router.get('/employees', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/employees
router.post('/employees', authenticateToken, async (req, res) => {
  try {
    const newEmp = await Employee.create({
      ...req.body,
      code: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      leaveBalance: { total: 20, available: 20, used: 0, pending: 0 },
      careerTimeline: [
        {
          id: `c-${Date.now()}`,
          date: 'Today',
          title: `Onboarded as ${req.body.role || 'Personnel'}`,
          description: 'Onboarded via Nexora HR smart database system.'
        }
      ]
    });

    // Create user login credential implicitly
    const passHash = await hashPassword('password');
    await User.create({
      email: newEmp.email,
      passwordHash: passHash,
      role: 'employee',
      employeeId: newEmp.id
    });

    // Create default payroll
    await Payroll.create({
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      empCode: newEmp.code,
      baseSalary: req.body.salary || '110,000',
      status: 'Processing',
      payoutDate: 'Next cycle',
      payPeriod: 'Semi-monthly'
    });

    // Log action
    await AuditLog.create({
      actor: 'Admin HR Officer',
      action: 'ADD_EMPLOYEE',
      details: `Onboarded employee ${newEmp.name} (${newEmp.code})`,
      timestamp: 'Just now'
    });

    res.status(201).json(newEmp);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/employees/:id
router.get('/employees/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });

    res.json(emp);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/employees/:id
router.put('/employees/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    // Allow admins, or the employee himself
    if (req.user?.role !== 'admin' && req.user?.employeeId !== id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const emp = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });

    res.json(emp);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/employees/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can offboard employees.' });
    }

    const emp = await Employee.findByIdAndDelete(id);
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });

    // Clean credentials and payroll
    await User.deleteOne({ employeeId: id });
    await Payroll.deleteMany({ employeeId: id });

    await AuditLog.create({
      actor: 'Admin HR Officer',
      action: 'OFFBOARD_EMPLOYEE',
      details: `Decommissioned profile for ${emp.name}`,
      timestamp: 'Just now'
    });

    res.json({ message: 'Employee deleted.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// ATTENDANCE APIs
// ----------------------------------------------------

// POST /api/attendance/check-in
router.post('/attendance/check-in', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) return res.status(400).json({ message: 'User is not linked to an employee.' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existing = await Attendance.findOne({ empCode: employee.code, date: today });
    if (existing) {
      return res.status(400).json({ message: 'Already punched in for today.' });
    }

    const now = new Date();
    const clockinHour = now.getHours();
    const clockinMinutes = now.getMinutes();

    // Determine status (Late after 09:30 AM)
    let status: 'Present' | 'Late' = 'Present';
    if (clockinHour > 9 || (clockinHour === 9 && clockinMinutes > 30)) {
      status = 'Late';
    }

    const newLog = await Attendance.create({
      employeeId: employee.id,
      employeeName: employee.name,
      empCode: employee.code,
      avatar: employee.avatar,
      department: employee.department,
      status,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: today
    });

    // Update Employee Status
    await Employee.findByIdAndUpdate(employee.id, { status });

    res.json(newLog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/attendance/check-out
router.post('/attendance/check-out', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) return res.status(400).json({ message: 'User is not linked to an employee.' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const today = new Date().toISOString().split('T')[0];

    const attendanceLog = await Attendance.findOne({ empCode: employee.code, date: today });
    if (!attendanceLog) {
      return res.status(400).json({ message: 'No active punch-in log found for today.' });
    }

    if (attendanceLog.checkoutTime) {
      return res.status(400).json({ message: 'Already punched out for today.' });
    }

    const now = new Date();
    const checkoutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate duration (mock decimal calculation or exact)
    const duration = '8.2h';

    attendanceLog.checkoutTime = checkoutTime;
    attendanceLog.duration = duration;
    await attendanceLog.save();

    // Reset Employee Status to Absent/Not checked-in
    await Employee.findByIdAndUpdate(employee.id, { status: 'Absent' });

    res.json(attendanceLog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance
router.get('/attendance', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // If admin: return all logs. If employee: return only self logs.
    if (req.user?.role === 'admin') {
      const logs = await Attendance.find().sort({ date: -1, createdAt: -1 });
      res.json(logs);
    } else {
      const logs = await Attendance.find({ employeeId: req.user?.employeeId }).sort({ date: -1, createdAt: -1 });
      res.json(logs);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/:employeeId
router.get('/attendance/:employeeId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user?.role !== 'admin' && req.user?.employeeId !== employeeId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const logs = await Attendance.find({ employeeId }).sort({ date: -1, createdAt: -1 });
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// LEAVE & PTO APIs
// ----------------------------------------------------

// POST /api/leave
router.post('/leave', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) return res.status(400).json({ message: 'User not linked to an employee.' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    const newReq = await LeaveRequest.create({
      employeeName: employee.name,
      empCode: employee.code,
      avatar: employee.avatar,
      type: req.body.type,
      dates: req.body.dates,
      duration: req.body.duration,
      reason: req.body.reason,
      status: 'Pending',
      appliedDate: 'Today'
    });

    // Update leave pending counts
    const available = employee.leaveBalance.available;
    const pending = employee.leaveBalance.pending + 1;
    await Employee.findByIdAndUpdate(employee.id, {
      'leaveBalance.pending': pending
    });

    res.status(201).json(newReq);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leave
router.get('/leave', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      const list = await LeaveRequest.find().sort({ createdAt: -1 });
      res.json(list);
    } else {
      const employee = await Employee.findById(req.user?.employeeId);
      if (!employee) return res.json([]);
      const list = await LeaveRequest.find({ empCode: employee.code }).sort({ createdAt: -1 });
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/leave/:id/approve
router.put('/leave/:id/approve', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Only admins approve leave.' });

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Request not found.' });

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Request is already processed.' });
    }

    leave.status = 'Approved';
    await leave.save();

    // Deduct leave balance
    const employee = await Employee.findOne({ code: leave.empCode });
    if (employee) {
      const days = parseInt(leave.duration) || 1;
      const newAvail = Math.max(0, employee.leaveBalance.available - days);
      const newUsed = employee.leaveBalance.used + days;
      const newPending = Math.max(0, employee.leaveBalance.pending - 1);
      
      employee.leaveBalance.available = newAvail;
      employee.leaveBalance.used = newUsed;
      employee.leaveBalance.pending = newPending;
      employee.status = 'On Leave';
      await employee.save();
    }

    res.json(leave);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/leave/:id/reject
router.put('/leave/:id/reject', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Only admins reject leave.' });

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Request not found.' });

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Request is already processed.' });
    }

    leave.status = 'Rejected';
    await leave.save();

    const employee = await Employee.findOne({ code: leave.empCode });
    if (employee) {
      const newPending = Math.max(0, employee.leaveBalance.pending - 1);
      employee.leaveBalance.pending = newPending;
      await employee.save();
    }

    res.json(leave);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// PAYROLL APIs
// ----------------------------------------------------

// GET /api/payroll
router.get('/payroll', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      const list = await Payroll.find().sort({ createdAt: -1 });
      res.json(list);
    } else {
      const list = await Payroll.find({ employeeId: req.user?.employeeId }).sort({ createdAt: -1 });
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payroll/:employeeId
router.get('/payroll/:employeeId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user?.role !== 'admin' && req.user?.employeeId !== employeeId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const item = await Payroll.findOne({ employeeId });
    res.json(item ? [item] : []);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payroll/:employeeId
router.put('/payroll/:employeeId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only HR can modify salaries.' });
    }
    const item = await Payroll.findOneAndUpdate({ employeeId }, req.body, { new: true });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// DOCUMENTS APIs
// ----------------------------------------------------

// GET /api/documents
router.get('/documents', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Return company documents AND self employee documents
    if (req.user?.role === 'admin') {
      const docs = await DocModel.find();
      res.json(docs);
    } else {
      const docs = await DocModel.find({
        $or: [
          { employeeId: req.user?.employeeId },
          { employeeId: { $exists: false } },
          { employeeId: '' }
        ]
      });
      res.json(docs);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/documents
router.post('/documents', authenticateToken, async (req, res) => {
  try {
    const doc = await DocModel.create({
      title: req.body.title,
      category: req.body.category,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: req.body.size || '1.2 MB',
      url: '#',
      employeeId: req.body.employeeId
    });
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/documents/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await DocModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// NOTIFICATIONS APIs
// ----------------------------------------------------

// GET /api/notifications
router.get('/notifications', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const notes = await Notification.find({
      $or: [
        { employeeId: 'all' },
        { employeeId: req.user?.employeeId }
      ]
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// AUTOMATIONS & AUDITS
// ----------------------------------------------------
router.get('/automations', authenticateToken, async (req, res) => {
  try {
    const list = await AutomationRule.find();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/automations', authenticateToken, async (req, res) => {
  try {
    const item = await AutomationRule.create({
      ...req.body,
      runsCount: 0,
      lastTriggered: 'Never'
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/automations/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const item = await AutomationRule.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Workflow not found.' });

    item.status = item.status === 'Active' ? 'Paused' : 'Active';
    await item.save();
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/audits', authenticateToken, async (req, res) => {
  try {
    const list = await AuditLog.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// ANALYTICS APIs
// ----------------------------------------------------

// GET /api/analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const presentEmployees = await Employee.countDocuments({ status: 'Present' });
    const lateEmployees = await Employee.countDocuments({ status: 'Late' });

    const efficiency = totalEmployees > 0 ? Math.round(((presentEmployees + lateEmployees) / totalEmployees) * 100) : 100;

    res.json({
      retentionRate: 98,
      attendanceEfficiency: efficiency,
      burnoutRiskIndex: 3,
      overtimeLogged: 42,
      timelineData: [
        { day: 'Mon', actual: 96, expected: 95, label: 'Oct 2' },
        { day: 'Tue', actual: 98, expected: 95, label: 'Oct 3' },
        { day: 'Wed', actual: 94, expected: 95, label: 'Oct 4' },
        { day: 'Thu', actual: 99, expected: 95, label: 'Oct 5' },
        { day: 'Fri', actual: 92, expected: 95, label: 'Oct 6' },
      ]
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------------------------
// AI APIs (STUDIO / GEMINI INTEGRATION)
// ----------------------------------------------------

// POST /api/ai/chat
router.post('/ai/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Fallback Mock Responses when Gemini Key is not set
    let reply = "Hello! I am your Nexora AI HR Assistant. Please configure a valid GEMINI_API_KEY in the .env configuration to initialize complete intelligence pipelines.";
    const query = message.toLowerCase();

    if (query.includes('attendance') || query.includes('late')) {
      reply = "Analyzing active attendance streams. Sarah Connor is currently marked as 'On Leave' (PTO), while Jordan Vance checked in on-time at 08:45 AM. The overall department attendance rate is at 95.2%.";
    } else if (query.includes('leave') || query.includes('pto')) {
      reply = "Alex Rivers has a pending Annual Leave request (Nov 14 - Nov 16) in the queue. Conflict check results: No direct overlapping leaves on the Design team; department capacity is expected to be at 92%. Recommendation: Approve.";
    }

    return res.json({
      text: reply,
      widget: query.includes('attendance') ? {
        type: 'attendance_breakdown',
        data: { availability: '95.2%', pto: 1, sick: 0 }
      } : undefined
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: message,
      config: {
        systemInstruction: 'You are the Nexora AI Assistant. You assist with HR queries, employee directories, leaves, and analytics context.'
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    res.status(500).json({ message: 'AI Processing Error: ' + err.message });
  }
});

// POST /api/ai/insights
router.post('/ai/insights', async (req, res) => {
  res.json({
    summary: 'Autonomous telemetry reports nominal operations. Active headcount stands at 124 personnel. Design alignment tasks are at 100% capacity.'
  });
});

// POST /api/ai/leave-assistant
router.post('/ai/leave-assistant', async (req, res) => {
  res.json({
    conflictFound: false,
    reason: 'Zero overlapping leave schedules inside the specific Design department. Coverage remains adequate at 92%.'
  });
});

export default router;
