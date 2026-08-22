import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  roleRequired?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // If Admin/HR is required but user is an employee, redirect to employee home
    if (roleRequired === 'admin' && userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  // Allow access (renders child routes)
  return <Outlet />;
};
