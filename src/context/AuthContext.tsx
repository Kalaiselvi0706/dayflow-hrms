import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Employee } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  currentUser: User | null;
  currentEmployee: Employee | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexora_auth') === 'true';
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('nexora_role') as UserRole) || 'admin';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexora_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(() => {
    const savedEmp = localStorage.getItem('nexora_employee');
    return savedEmp ? JSON.parse(savedEmp) : null;
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('nexora_role', role);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Login failed.');
        return false;
      }

      const data = await response.json();
      
      setIsAuthenticated(true);
      setUserRoleState(data.user.role);
      setCurrentUser(data.user);
      setCurrentEmployee(data.user.employee || null);

      localStorage.setItem('nexora_auth', 'true');
      localStorage.setItem('nexora_token', data.token);
      localStorage.setItem('nexora_role', data.user.role);
      localStorage.setItem('nexora_user', JSON.stringify(data.user));
      if (data.user.employee) {
        localStorage.setItem('nexora_employee', JSON.stringify(data.user.employee));
      } else {
        localStorage.removeItem('nexora_employee');
      }

      return true;
    } catch (err: any) {
      alert('Network error: ' + err.message);
      return false;
    }
  };

  const logout = () => {
    // Fire optional logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

    setIsAuthenticated(false);
    setUserRoleState('employee');
    setCurrentUser(null);
    setCurrentEmployee(null);

    localStorage.removeItem('nexora_auth');
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_role');
    localStorage.removeItem('nexora_user');
    localStorage.removeItem('nexora_employee');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        currentUser,
        currentEmployee,
        login,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
