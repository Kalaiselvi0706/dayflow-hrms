# 🚀 NexaFlow HR

### From HR Management to Workforce Intelligence

**NexaFlow HR** is an AI-powered Human Resource Management System designed to centralize employee management, attendance, leave management, payroll visibility, workforce analytics, and intelligent HR assistance in one unified platform.

Built for the **Odoo × NMIT Bangalore Hackathon 2026**.

---

## 💡 About the Project

Traditional HR systems mainly store employee information and record HR activities.

NexaFlow HR goes beyond basic HR management by combining:

**HR Management + Workforce Intelligence + AI Assistance + Workflow Automation**

The platform provides separate experiences for:

* 👩‍💼 HR / Admin
* 👨‍💻 Employees

HR administrators can manage the organization's workforce, while employees can securely access and manage their own HR information.

---

## 🎯 Problem Statement

Organizations manage large amounts of employee information across different HR processes such as:

* Employee profiles
* Attendance
* Leave requests
* Approvals
* Payroll
* Documents
* HR reports

This can make HR operations fragmented and time-consuming.

NexaFlow HR brings these processes into a single intelligent platform and provides AI-powered insights to help HR teams identify what needs attention.

---

## ✨ Key Features

### 👩‍💼 HR / Admin

* Organization-wide employee management
* Employee 360° profiles
* Attendance monitoring
* Leave approval and rejection
* Payroll management
* Workforce analytics
* Department insights
* Document management
* Smart HR Action Inbox
* Notifications
* Audit Center
* Workflow automation

### 👨‍💻 Employee Self-Service

* Personal profile
* Check-in / Check-out
* Attendance history
* Leave application
* Leave status tracking
* Payroll and payslip visibility
* Document access
* Onboarding checklist
* Notifications
* AI assistance

---

# 🤖 AI-Powered Features

## ✦ Nexa AI Copilot

An intelligent HR assistant that allows HR and employees to interact with workforce information using natural language.

Example queries:

> "Who is absent today?"

> "Show pending leave requests."

> "Which department has the highest late attendance?"

> "Summarize today's attendance."

---

## 🧠 AI Workforce Intelligence

NexaFlow analyzes workforce data and provides insights such as:

* Attendance trends
* Late check-in patterns
* Leave trends
* Department availability
* Workforce activity
* HR priorities

AI provides decision-support insights while important HR actions remain under authorized human control.

---

## 📝 Smart Leave Assistant

Employees can describe their leave request naturally.

Example:

> "I need leave from Monday to Wednesday for a family function."

The AI assistant can understand the request and prepare the leave form for employee confirmation.

The request is never submitted automatically without employee confirmation.

---

## 📊 AI Daily HR Summary

The HR dashboard provides an intelligent daily summary of:

* Employees present
* Employees on leave
* Pending approvals
* Attendance trends
* Important HR actions

---

## ⚡ HR Workflow Automation

NexaFlow supports rule-based HR workflows such as:

```text
WHEN
Employee submits leave request

IF
Leave duration > 3 days

THEN
Create HR approval task
```

Other examples include attendance reminders and document verification alerts.

---

# 🏢 Core HR Modules

### Employee Management

Manage employee profiles, departments, positions, joining dates, and employment status.

### Attendance

* Check-in
* Check-out
* Working hours
* Daily attendance
* Weekly attendance
* Attendance analytics

### Leave Management

* Paid leave
* Sick leave
* Unpaid leave
* Leave requests
* Approval workflow
* Rejection comments
* Leave history

### Payroll

* Salary information
* Allowances
* Deductions
* Net salary
* Payslip visibility

### Documents

Secure employee document management for:

* Identity documents
* Employment documents
* Payroll documents
* Certificates
* Policies

### Notifications

Real-time-style notifications for:

* Leave approvals
* Attendance reminders
* Documents
* Payroll
* HR actions

### Audit Center

Track important system activities such as:

* Leave approvals
* Employee updates
* Attendance corrections
* Document uploads

---

# 👥 Role-Based Access

NexaFlow HR provides separate permissions for different users.

| Feature              | HR / Admin | Employee |
| -------------------- | ---------- | -------- |
| View all employees   | ✅          | ❌        |
| Manage employees     | ✅          | Limited  |
| View all attendance  | ✅          | ❌        |
| View own attendance  | ✅          | ✅        |
| Check-in / Check-out | ✅          | ✅        |
| Apply for leave      | ✅          | ✅        |
| Approve leave        | ✅          | ❌        |
| View payroll         | ✅          | Own only |
| Manage salary        | ✅          | ❌        |
| View documents       | Authorized | Own      |
| AI Assistant         | ✅          | ✅        |

---

# 🛠️ Technology Stack

## Frontend

* HTML
* CSS
* JavaScript
* Modern responsive UI

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB

## AI

* Google Gemini
* Google AI Studio

## UI / Design

* Google Stitch

## Development

* Antigravity

## Version Control

* Git
* GitHub

---

# 🏗️ System Architecture

```text
                    NEXAFLOW HR
                         |
                  Authentication
                         |
              ┌──────────┴──────────┐
              |                     |
          HR / ADMIN             EMPLOYEE
              |                     |
       HR Command Center      Employee Dashboard
              |                     |
      ┌───────┼────────┐      ┌─────┼─────┐
      |       |        |      |     |     |
 Employees Attendance Leave  Profile Leave Payroll
      |       |        |      |     |
      └───────┼────────┘      └─────┘
              |
           Payroll
              |
       Workforce Analytics
              |
         Gemini AI Layer
              |
       Nexa AI Copilot
              |
           Database
```

---

# 📁 Project Structure

```text
nexaflow-hr/
│
├── frontend/
│   ├── index.html
│   ├── assets/
│   └── components/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── models/
│
├── README.md
├── .gitignore
└── package.json
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nexaflow-hr.git
```

## 2. Open the project

```bash
cd nexaflow-hr
```

## 3. Install backend dependencies

```bash
cd backend
npm install
```

## 4. Start the backend

```bash
node server.js
```

Backend will run on:

```text
http://localhost:5000
```

## 5. Run the frontend

Open the frontend application using your preferred local development server.

---

# 🔐 Security

NexaFlow HR is designed with:

* Role-based access control
* Protected routes
* Employee data isolation
* Secure authentication
* Input validation
* Authorized HR actions
* Audit logging

Sensitive HR actions such as payroll modification and leave approval remain under authorized HR control.

---

# 🎥 Hackathon Demo Flow

The recommended demonstration flow is:

```text
Employee Login
      ↓
Employee Dashboard
      ↓
Check In
      ↓
Smart Leave Assistant
      ↓
Submit Leave Request
      ↓
HR Login
      ↓
AI Daily Briefing
      ↓
HR Action Center
      ↓
Approve Leave
      ↓
Attendance Intelligence
      ↓
Employee 360°
      ↓
Payroll
      ↓
Nexa AI Copilot
      ↓
AI Workforce Report
```

---

# 🌟 Our USP

### Traditional HRMS

```text
Record → Store → Display
```

### NexaFlow HR

```text
Record
   ↓
Understand
   ↓
Analyze
   ↓
Identify
   ↓
Prioritize
   ↓
Assist
   ↓
Act
```

NexaFlow HR transforms a traditional HR management system into an **AI-assisted Workforce Intelligence platform**.

---

# 🏆 Hackathon

**Event:** Odoo × NMIT Bangalore Hackathon 2026

**Project:** NexaFlow HR

**Category:** AI-Powered Human Resource Management

**Team:** NexaFlow Team

---

# 📌 Project Status

🚧 **Hackathon Development in Progress**

Core HRMS modules and AI-powered workforce intelligence features are being developed and integrated progressively.

---

## 👥 Team

**Team NexaFlow**

Building a smarter, more connected future for HR.

---

### 📜 License

This project is developed for the Odoo × NMIT Bangalore Hackathon 2026.
