import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nexora-secret-token-key-2026';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'employee';
    employeeId?: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: string; email: string; role: 'admin' | 'employee'; employeeId?: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token has expired or is invalid.' });
    }
    req.user = decoded;
    next();
  });
}

export function requireRole(roles: ('admin' | 'employee')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
    }

    next();
  };
}
