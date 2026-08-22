# Nexora HR – Human Resource Management System

Nexora HR is a modern, AI-powered Human Resource Management System (HRMS) designed to simplify and automate essential HR and employee management activities.

The system provides separate experiences for HR administrators and employees, with features such as employee management, attendance tracking, leave management, payroll management, employee profiles, and an AI-powered HR assistant.

## 🚀 Features

### 👨‍💼 HR / Admin Dashboard
- View overall workforce statistics
- Manage employees
- Monitor attendance
- Review and approve/reject leave requests
- Manage payroll information
- View HR activities and notifications
- Access workforce insights

### 👤 Employee Management
- Employee directory
- Employee profiles
- Department and role information
- Employee career timeline
- Leave balance tracking
- Employee status management

### 🕐 Live Attendance
- Employee check-in and check-out
- Real-time attendance records
- Present, Late and Absent status
- Attendance filtering
- Manual attendance override
- Attendance duration tracking

### 🏖️ Leave Management
- Submit leave requests
- Annual Leave
- Sick Leave
- Maternity Leave
- Paternity Leave
- Unpaid Leave
- Leave duration and reason tracking
- Admin approval/rejection workflow
- Leave balance management

### 💰 Payroll Management
- Employee salary information
- Payroll status tracking
- Payment processing status
- Payout dates
- Benefits and compensation information

### 🤖 Nexora AI
Nexora includes an AI-powered HR assistant that can help users with HR-related queries and provide workforce information and insights.

### 🔐 Authentication
- Employee and Admin login
- JWT-based authentication
- Role-based access control
- Protected API routes

## 🛠️ Technology Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- REST API
- JWT Authentication

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### AI
- Google Gemini API

### Deployment
- Vercel – Frontend deployment
- MongoDB Atlas – Cloud database

## 📁 Project Structure

```text
nexora-hr/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── screens/
│   ├── services/
│   ├── types.ts
│   └── ...
│
├── server/
│   ├── index.ts
│   ├── models.ts
│   └── routes.ts
│
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
