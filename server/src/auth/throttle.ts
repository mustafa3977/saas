import { Request } from 'express';
import { query } from '../db.js';

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function customerThrottleKey(email: string, ip: string): string {
  return `customer:${email.toLowerCase().trim()}:${ip}`;
}

export function adminThrottleKey(ip: string): string {
  return `admin:${ip}`;
}

export async function isThrottled(key: string, maxAttempts: number, windowMinutes: number): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }
  try {
    const rows = await query<{ count: string | number }>(
      `SELECT COUNT(*)::int AS count 
       FROM login_attempts 
       WHERE key = $1 AND created_at > NOW() - ($2 * INTERVAL '1 minute')`,
      [key, windowMinutes]
    );
    const count = Number(rows[0]?.count || 0);
    return count >= maxAttempts;
  } catch (err) {
    console.error('Throttle check DB error:', err);
    return false;
  }
}

export async function recordFailedAttempt(key: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    return;
  }
  try {
    await query(
      `INSERT INTO login_attempts (key) VALUES ($1)`,
      [key]
    );
  } catch (err) {
    console.error('Record failed attempt DB error:', err);
  }
}

export async function clearAttempts(key: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    return;
  }
  try {
    await query(
      `DELETE FROM login_attempts WHERE key = $1`,
      [key]
    );
  } catch (err) {
    console.error('Clear attempts DB error:', err);
  }
}
