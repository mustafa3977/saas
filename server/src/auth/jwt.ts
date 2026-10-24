import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  role: 'user';
}

export interface AdminUser {
  role: 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      admin?: AdminUser;
    }
  }
}

export function generateUserToken(userId: number | string): string {
  const secret = process.env.JWT_SECRET || 'lp_jwt_secret_dev';
  return jwt.sign(
    { sub: String(userId), role: 'user' },
    secret,
    { expiresIn: '7d' }
  );
}

export function generateAdminToken(): string {
  const secret = process.env.ADMIN_JWT_SECRET || 'lp_admin_jwt_secret_dev';
  return jwt.sign(
    { role: 'admin' },
    secret,
    { expiresIn: '12h' }
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Please sign up or log in to continue.',
    });
  }

  const token = authHeader.substring(7).trim();
  const secret = process.env.JWT_SECRET || 'lp_jwt_secret_dev';

  try {
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded || decoded.role !== 'user' || !decoded.sub) {
      return res.status(401).json({
        success: false,
        error: 'Please sign up or log in to continue.',
      });
    }

    req.user = {
      id: Number(decoded.sub),
      role: 'user',
    };
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Please sign up or log in to continue.',
    });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Admin authentication required',
    });
  }

  const token = authHeader.substring(7).trim();
  const adminSecret = process.env.ADMIN_JWT_SECRET || 'lp_admin_jwt_secret_dev';

  try {
    const decoded = jwt.verify(token, adminSecret) as any;
    if (decoded && decoded.role === 'admin') {
      req.admin = { role: 'admin' };
      return next();
    }
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access required',
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access required',
    });
  }
}
