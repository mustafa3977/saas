import crypto from 'crypto';

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    const dummy = crypto.createHash('sha256').update('unconfigured_admin_password_protection').digest();
    const input = crypto.createHash('sha256').update(password).digest();
    crypto.timingSafeEqual(input, dummy);
    return false;
  }

  const inputHash = crypto.createHash('sha256').update(password).digest();
  const adminHash = crypto.createHash('sha256').update(adminPassword).digest();

  return crypto.timingSafeEqual(inputHash, adminHash);
}
