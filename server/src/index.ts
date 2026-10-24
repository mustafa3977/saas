import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmetImport from 'helmet';
import rateLimitImport from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { pino } from 'pino';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';

import {
  SERVICES_CATALOG,
  STATS_DATA,
  AWARDS_DATA,
  TESTIMONIALS_DATA,
  BLOG_POSTS_DATA,
  MUSIC_ADDONS,
  quoteLeadSchema,
  contactMessageSchema,
  createOrderDraftSchema,
  createOrderSchema,
  orderStatusSchema,
} from '@legacypixels/shared';

import { query } from './db.js';
import {
  generateUserToken,
  generateAdminToken,
  requireAuth,
  requireAdmin,
} from './auth/jwt.js';
import { verifyAdminPassword } from './auth/adminAuth.js';
import {
  getClientIp,
  customerThrottleKey,
  adminThrottleKey,
  isThrottled,
  recordFailedAttempt,
  clearAttempts,
} from './auth/throttle.js';

dotenv.config();
const helmet = (helmetImport as any).default ?? helmetImport;
const rateLimit = (rateLimitImport as any).default ?? rateLimitImport;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security middlewares
app.use(helmet());

const allowedOrigins = [
  'https://legacypixels.net',
  'https://www.legacypixels.net',
  'http://localhost:5173',
];
if (CLIENT_URL && !allowedOrigins.includes(CLIENT_URL)) {
  allowedOrigins.push(CLIENT_URL);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.some((o) => o.replace(/\/$/, '') === cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  allowedHeaders: ['Authorization', 'Content-Type', 'Cache-Control'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET || 'lp_cookie_secret_dev'));
app.use(express.json({ limit: '1mb' }));

// Rate limiter for general public API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Google OAuth client
const googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

// Audit Log Helper
async function logAudit(
  entity: string,
  entityId: string | number,
  action: string,
  before: any,
  after: any
) {
  try {
    await query(
      `INSERT INTO audit_log (entity, entity_id, action, before, after, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        entity,
        String(entityId),
        action,
        before ? JSON.stringify(before) : null,
        after ? JSON.stringify(after) : null,
      ]
    );
  } catch (err) {
    logger.error({ err }, 'Failed to record audit log');
  }
}

// Zod schemas for Auth validation
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential token is required'),
});

const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

const adminItemStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Legacy Pixels API',
    version: '1.0.0',
  });
});

// --- Customer Auth Endpoints ---

// POST /api/auth/register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid input data',
      });
    }

    const { name, email, password } = parseResult.data;
    const ip = getClientIp(req);
    const throttleKey = customerThrottleKey(email, ip);

    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please try again in 10 minutes.',
      });
    }

    const existingUsers = await query<{ id: number; auth_provider: string }>(
      'SELECT id, auth_provider FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingUsers.length > 0) {
      await recordFailedAttempt(throttleKey);
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query<{ id: number; name: string; email: string; created_at: string }>(
      `INSERT INTO users (name, email, password_hash, auth_provider, created_at)
       VALUES ($1, $2, $3, 'password', NOW())
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const newUser = result[0];
    await clearAttempts(throttleKey);

    const token = generateUserToken(newUser.id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Registration error');
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again later.',
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const { email, password } = parseResult.data;
    const ip = getClientIp(req);
    const throttleKey = customerThrottleKey(email, ip);

    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please try again in 10 minutes.',
      });
    }

    const users = await query<{ id: number; name: string; email: string; password_hash: string | null }>(
      'SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (users.length === 0) {
      await recordFailedAttempt(throttleKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const user = users[0];
    if (!user.password_hash) {
      await recordFailedAttempt(throttleKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      await recordFailedAttempt(throttleKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    await clearAttempts(throttleKey);
    const token = generateUserToken(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Login error');
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again later.',
    });
  }
});

// POST /api/auth/google
app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    const parseResult = googleAuthSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google credential token',
      });
    }

    const ip = getClientIp(req);
    const throttleKey = `google_auth_${ip}`;
    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many authentication attempts. Please try again in 10 minutes.',
      });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({
        success: false,
        error: 'Google Authentication is not configured on this server.',
      });
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: parseResult.data.credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.email_verified) {
      await recordFailedAttempt(throttleKey);
      return res.status(400).json({
        success: false,
        error: 'Unverified or missing email from Google account.',
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || payload.given_name || email.split('@')[0];

    // Find user by google_id, else by email (and link google_id), else create user
    let userRow: { id: number; name: string; email: string; google_id?: string | null } | undefined;

    const byGoogleId = await query<{ id: number; name: string; email: string; google_id: string }>(
      'SELECT id, name, email, google_id FROM users WHERE google_id = $1',
      [googleId]
    );

    if (byGoogleId.length > 0) {
      userRow = byGoogleId[0];
    } else {
      const byEmail = await query<{ id: number; name: string; email: string; google_id: string | null }>(
        'SELECT id, name, email, google_id FROM users WHERE LOWER(email) = LOWER($1)',
        [email]
      );

      if (byEmail.length > 0) {
        userRow = byEmail[0];
        await query(
          'UPDATE users SET google_id = $1, auth_provider = COALESCE(auth_provider, $2) WHERE id = $3',
          [googleId, 'google', userRow.id]
        );
      } else {
        const created = await query<{ id: number; name: string; email: string }>(
          `INSERT INTO users (name, email, password_hash, google_id, auth_provider, created_at)
           VALUES ($1, $2, NULL, $3, 'google', NOW())
           RETURNING id, name, email`,
          [name, email, googleId]
        );
        userRow = created[0];
      }
    }

    await clearAttempts(throttleKey);
    const token = generateUserToken(userRow.id);

    return res.json({
      success: true,
      token,
      user: {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Google auth error');
    return res.status(401).json({
      success: false,
      error: 'Google authentication failed. Please try again.',
    });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const users = await query<{ id: number; name: string; email: string; created_at: string }>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.json({
      success: true,
      user: users[0],
    });
  } catch (err: any) {
    logger.error({ err }, 'Auth me error');
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile',
    });
  }
});

// --- Admin Auth Endpoints ---

// POST /api/admin/login
app.post('/api/admin/login', async (req: Request, res: Response) => {
  try {
    const parseResult = adminLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    const { password } = parseResult.data;
    const ip = getClientIp(req);
    const throttleKey = adminThrottleKey(ip);

    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed admin login attempts. Please try again in 10 minutes.',
      });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      await recordFailedAttempt(throttleKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid administrative password',
      });
    }

    await clearAttempts(throttleKey);
    const token = generateAdminToken();

    return res.json({
      success: true,
      token,
      admin: {
        role: 'admin',
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Admin login error');
    return res.status(500).json({
      success: false,
      error: 'Administrative login failed.',
    });
  }
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    success: true,
    admin: {
      role: 'admin',
    },
  });
});

// --- Public Leads & Contact ---

// POST /api/leads
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const validatedData = quoteLeadSchema.parse(req.body);
    logger.info({ lead: validatedData }, 'New Quote Lead Received');

    const result = await query<{ id: number }>(
      `INSERT INTO quote_leads (service_slug, name, email, payload, status, created_at)
       VALUES ($1, $2, $3, $4, 'new', NOW())
       RETURNING id`,
      [
        validatedData.serviceSlug,
        validatedData.name,
        validatedData.email,
        JSON.stringify(validatedData),
      ]
    );

    const leadId = result[0]?.id ? `lead_${result[0].id}` : `lead_${Date.now()}`;
    return res.status(201).json({
      success: true,
      message: 'Thank you for your project brief. A producer will contact you within 24 hours.',
      leadId,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// POST /api/contact
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const validatedData = contactMessageSchema.parse(req.body);
    logger.info({ contact: validatedData }, 'Contact Message Received');

    await query(
      `INSERT INTO contact_messages (name, email, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, 'new', NOW())`,
      [validatedData.name, validatedData.email, validatedData.subject, validatedData.message]
    );

    return res.status(200).json({
      success: true,
      message: 'Message delivered. The Legacy Pixels production desk will be in touch shortly.',
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// --- Server-Side Pricing Calculation Helper ---
async function calculateOrderTotal(
  serviceSlug: string,
  packageId: string,
  fastDelivery: boolean,
  extraRevisionsCount: number,
  addons: { addonId: string }[]
): Promise<{
  totalAmount: number;
  packagePrice: number;
  fastDeliveryPrice: number;
  extraRevisionsPrice: number;
  addonsPrice: number;
  unitPrices: Record<string, number>;
}> {
  let packagePriceCents = 0;
  let serviceData: any = null;

  try {
    const serviceRows = await query<{ data: any }>(
      'SELECT data FROM services WHERE slug = $1 AND active = true',
      [serviceSlug]
    );
    if (serviceRows.length > 0) {
      serviceData = serviceRows[0].data;
    }
  } catch {
    // DB fallback
  }

  if (!serviceData) {
    serviceData = SERVICES_CATALOG.find((s) => s.slug === serviceSlug);
  }

  if (serviceData && Array.isArray(serviceData.packages)) {
    const pkg = serviceData.packages.find((p: any) => p.id === packageId);
    if (pkg && typeof pkg.priceCents === 'number') {
      packagePriceCents = pkg.priceCents;
    }
  }

  // Fallback defaults for music packages if not found
  if (packagePriceCents === 0) {
    if (packageId === 'pkg-personal-song') packagePriceCents = 2900;
    else if (packageId === 'pkg-cinematic-song') packagePriceCents = 5900;
    else if (packageId === 'pkg-signature-anthem') packagePriceCents = 9900;
    else packagePriceCents = serviceData?.startingPriceCents || 2900;
  }

  const fastDeliveryPriceCents = fastDelivery ? 900 : 0; // $9
  const extraRevisionUnitPriceCents = 1000; // $10 per revision
  const extraRevisionsPriceCents = Math.max(0, extraRevisionsCount) * extraRevisionUnitPriceCents;

  let addonsPriceCents = 0;
  if (Array.isArray(addons)) {
    for (const addon of addons) {
      if (addon.addonId === 'stems') {
        addonsPriceCents += 1500; // $15
      } else if (addon.addonId === 'fast_delivery' && !fastDelivery) {
        addonsPriceCents += 900;
      }
    }
  }

  const totalCents =
    packagePriceCents + fastDeliveryPriceCents + extraRevisionsPriceCents + addonsPriceCents;

  return {
    totalAmount: totalCents / 100,
    packagePrice: packagePriceCents / 100,
    fastDeliveryPrice: fastDeliveryPriceCents / 100,
    extraRevisionsPrice: extraRevisionsPriceCents / 100,
    addonsPrice: addonsPriceCents / 100,
    unitPrices: {
      packagePriceCents,
      fastDeliveryPriceCents,
      extraRevisionUnitPriceCents,
      addonsPriceCents,
    },
  };
}

// Generate unique order number LP-<year>-<6 digits> with retry on collision
async function generateUniqueOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt++) {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const candidate = `LP-${year}-${rand}`;
    const existing = await query<{ id: number }>(
      'SELECT id FROM orders WHERE order_number = $1',
      [candidate]
    );
    if (existing.length === 0) {
      return candidate;
    }
  }
  return `LP-${year}-${Date.now().toString().slice(-6)}`;
}

// --- Customer Order Endpoints (Phase 2) ---

// POST /api/orders (requireAuth)
app.post('/api/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid order data',
      });
    }

    const { serviceSlug, packageId, item, brief, customer, notes } = parseResult.data;
    const userId = req.user!.id;

    // Recalculate price strictly on server
    const pricing = await calculateOrderTotal(
      serviceSlug,
      packageId,
      item.fastDelivery,
      item.additionalRevisionsCount,
      item.addons
    );

    const orderNumber = await generateUniqueOrderNumber();
    const customerEmail = customer.email || '';

    const payload = {
      serviceSlug,
      packageId,
      item: {
        packageId,
        packageName: item.packageName || packageId,
        fastDelivery: item.fastDelivery,
        additionalRevisionsCount: item.additionalRevisionsCount,
        addons: item.addons,
        unitPrices: pricing.unitPrices,
      },
      brief,
      customer,
      notes: notes || '',
      calculatedTotal: pricing.totalAmount,
    };

    const inserted = await query<{
      id: number;
      order_number: string;
      status: string;
      total_amount: number;
      created_at: string;
    }>(
      `INSERT INTO orders (user_id, order_number, service_slug, payload, status, customer_email, total_amount, currency, notes, updated_at)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, 'USD', $7, NOW())
       RETURNING id, order_number, status, total_amount, created_at`,
      [
        userId,
        orderNumber,
        serviceSlug,
        JSON.stringify(payload),
        customerEmail,
        pricing.totalAmount,
        notes || '',
      ]
    );

    const order = inserted[0];
    logger.info({ orderNumber, userId, total: pricing.totalAmount }, 'New Order Created as pending');

    return res.status(201).json({
      success: true,
      orderNumber: order.order_number,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      },
      message: 'We received your order. Our team will contact you to confirm details and payment.',
    });
  } catch (err: any) {
    logger.error({ err }, 'Order creation error');
    return res.status(500).json({ success: false, error: 'Failed to place order' });
  }
});

// Backward-compatible draft order initialization
app.post('/api/orders/draft', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderDraftSchema.parse(req.body);
    const orderNumber = await generateUniqueOrderNumber();

    const pricing = await calculateOrderTotal(
      validatedData.serviceSlug,
      validatedData.packageId,
      validatedData.item.fastDelivery,
      validatedData.item.additionalRevisionsCount,
      validatedData.item.addons
    );

    const customerEmail = validatedData.customer?.email || '';

    await query(
      `INSERT INTO orders (user_id, order_number, service_slug, payload, status, customer_email, total_amount, currency, updated_at)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, 'USD', NOW())`,
      [
        req.user?.id,
        orderNumber,
        validatedData.serviceSlug,
        JSON.stringify(validatedData),
        customerEmail,
        pricing.totalAmount,
      ]
    );

    return res.status(201).json({
      success: true,
      orderNumber,
      message: 'Order draft initialized successfully.',
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// Backward-compatible order submission
app.post('/api/orders/:orderNumber/submit', requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user?.id;

    const rows = await query<{ id: number; user_id: number; status: string; order_number: string }>(
      'SELECT id, user_id, status, order_number FROM orders WHERE order_number = $1',
      [orderNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to submit this order.',
      });
    }

    const updated = await query<{ id: number; order_number: string; status: string }>(
      `UPDATE orders SET status = 'pending', updated_at = NOW() WHERE order_number = $1 RETURNING id, order_number, status`,
      [orderNumber]
    );

    return res.json({
      success: true,
      message: 'We received your order. Our team will contact you to confirm details and payment.',
      data: updated[0],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to submit order' });
  }
});

// GET /api/orders/mine (requireAuth)
app.get('/api/orders/mine', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const rows = await query<any>(
      `SELECT id, order_number, service_slug, payload, status, customer_email, total_amount, currency, created_at, updated_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const orders = rows.map((r) => {
      let payload = r.payload;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      return {
        id: String(r.id),
        orderNumber: r.order_number,
        serviceSlug: r.service_slug,
        packageName: payload?.item?.packageName || payload?.packageId || r.service_slug,
        totalAmount: Number(r.total_amount || 0),
        currency: r.currency || 'USD',
        status: r.status || 'pending',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        payload,
      };
    });

    return res.json({ success: true, data: orders });
  } catch (err: any) {
    logger.error({ err }, 'Get user orders error');
    return res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
  }
});

// GET /api/orders/mine/:orderNumber (requireAuth)
app.get('/api/orders/mine/:orderNumber', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { orderNumber } = req.params;

    const rows = await query<any>(
      `SELECT id, order_number, service_slug, payload, status, customer_email, total_amount, currency, notes, created_at, updated_at
       FROM orders
       WHERE user_id = $1 AND order_number = $2`,
      [userId, orderNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const r = rows[0];
    let payload = r.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = {};
      }
    }

    return res.json({
      success: true,
      data: {
        id: String(r.id),
        orderNumber: r.order_number,
        serviceSlug: r.service_slug,
        packageName: payload?.item?.packageName || payload?.packageId || r.service_slug,
        totalAmount: Number(r.total_amount || 0),
        currency: r.currency || 'USD',
        status: r.status || 'pending',
        notes: r.notes || '',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        payload,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve order' });
  }
});

// --- Admin Orders & CRM Endpoints (Phase 4) ---

// GET /api/admin/orders
app.get('/api/admin/orders', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT o.id, o.order_number, o.service_slug, o.payload, o.status, o.customer_email, o.total_amount, o.currency, o.notes, o.created_at, o.updated_at,
             u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params: any[] = [];

    if (status && typeof status === 'string' && status.toUpperCase() !== 'ALL') {
      sql += ' WHERE LOWER(o.status) = LOWER($1)';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC';

    const rows = await query<any>(sql, params);

    const orders = rows.map((row) => {
      let payload = row.payload;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      payload = payload || {};

      const serviceTitle =
        SERVICES_CATALOG.find((s) => s.slug === row.service_slug)?.title?.en ||
        row.service_slug ||
        'Custom Service';

      const packageName =
        payload.item?.packageName ||
        payload.packageId ||
        serviceTitle;

      return {
        id: String(row.id),
        orderNumber: row.order_number,
        service: serviceTitle,
        serviceSlug: row.service_slug,
        packageName,
        recipientName: payload.brief?.recipientName || 'Valued Patron',
        customerName: row.user_name || payload.customer?.name || 'Valued Patron',
        customerEmail: row.customer_email || row.user_email || payload.customer?.email || '',
        customerPhone: payload.customer?.phone || '',
        totalAmount: Number(row.total_amount || 0),
        currency: row.currency || 'USD',
        notes: row.notes || '',
        status: row.status || 'pending',
        fulfillmentStatus: row.status || 'pending',
        paymentStatus: 'pending',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        payload,
        storyBrief: payload.brief?.storyDetails || '',
        genre: payload.brief?.genre || '',
        mood: payload.brief?.mood || '',
      };
    });

    return res.json({ success: true, data: orders });
  } catch (err: any) {
    logger.error({ err }, 'Admin get orders error');
    return res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
  }
});

// GET /api/admin/orders/:id
app.get('/api/admin/orders/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await query<any>(
      `SELECT o.id, o.order_number, o.service_slug, o.payload, o.status, o.customer_email, o.total_amount, o.currency, o.notes, o.created_at, o.updated_at,
              u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id::text = $1 OR o.order_number = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const row = rows[0];
    let payload = row.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = {};
      }
    }
    payload = payload || {};

    const serviceTitle =
      SERVICES_CATALOG.find((s) => s.slug === row.service_slug)?.title?.en ||
      row.service_slug ||
      'Custom Service';

    const order = {
      id: String(row.id),
      orderNumber: row.order_number,
      service: serviceTitle,
      serviceSlug: row.service_slug,
      packageName: payload.item?.packageName || payload.packageId || serviceTitle,
      recipientName: payload.brief?.recipientName || 'Valued Patron',
      customerName: row.user_name || payload.customer?.name || 'Valued Patron',
      customerEmail: row.customer_email || row.user_email || payload.customer?.email || '',
      customerPhone: payload.customer?.phone || '',
      totalAmount: Number(row.total_amount || 0),
      currency: row.currency || 'USD',
      notes: row.notes || '',
      status: row.status || 'pending',
      fulfillmentStatus: row.status || 'pending',
      paymentStatus: 'pending',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      payload,
      storyBrief: payload.brief?.storyDetails || '',
      genre: payload.brief?.genre || '',
      mood: payload.brief?.mood || '',
    };

    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve order' });
  }
});

// PATCH /api/admin/orders/:id/status
app.patch('/api/admin/orders/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedStatus = typeof req.body?.status === 'string' ? req.body.status.toLowerCase() : '';
    const parseResult = orderStatusSchema.safeParse(normalizedStatus);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${orderStatusSchema.options.join(', ')}`,
      });
    }

    const newStatus = parseResult.data;

    // Fetch before state for audit log
    const existing = await query<any>(
      'SELECT id, order_number, status, total_amount FROM orders WHERE id::text = $1 OR order_number = $1',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const beforeState = existing[0];

    const updated = await query<any>(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id::text = $2 OR order_number = $2
       RETURNING id, order_number, status, updated_at`,
      [newStatus, id]
    );

    await logAudit('order', beforeState.id, 'update_status', beforeState, updated[0]);

    return res.json({
      success: true,
      data: updated[0],
    });
  } catch (err: any) {
    logger.error({ err }, 'Admin update order status error');
    return res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// GET /api/admin/leads
app.get('/api/admin/leads', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT id, service_slug, name, email, payload, status, created_at
       FROM quote_leads
       ORDER BY created_at DESC`
    );

    const leads = rows.map((row) => {
      let payload = row.payload;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      payload = payload || {};

      return {
        id: String(row.id),
        name: row.name,
        email: row.email,
        phone: payload.phone || '',
        service: row.service_slug || 'General',
        serviceSlug: row.service_slug,
        budget: payload.budgetRange || payload.budget || 'Custom',
        timeline: payload.projectTimeline || payload.timeline || 'Flexible',
        message: payload.message || '',
        status: row.status || 'new',
        createdAt: row.created_at,
        payload,
      };
    });

    return res.json({ success: true, data: leads });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve quote leads' });
  }
});

// PATCH /api/admin/leads/:id/status
app.patch('/api/admin/leads/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedStatus = typeof req.body?.status === 'string' ? req.body.status.toLowerCase() : '';
    const parseResult = adminItemStatusSchema.safeParse({ status: normalizedStatus });
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Allowed values: new, contacted, closed',
      });
    }

    const beforeRows = await query<any>('SELECT id, status FROM quote_leads WHERE id::text = $1', [id]);
    if (beforeRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const updated = await query<any>(
      `UPDATE quote_leads
       SET status = $1
       WHERE id::text = $2
       RETURNING id, name, email, status`,
      [parseResult.data.status, id]
    );

    await logAudit('quote_lead', id, 'update_status', beforeRows[0], updated[0]);

    return res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to update lead status' });
  }
});

// GET /api/admin/messages
app.get('/api/admin/messages', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT id, name, email, subject, message, status, created_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );

    const messages = rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status || 'new',
      createdAt: row.created_at,
    }));

    return res.json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
  }
});

// PATCH /api/admin/messages/:id/status
app.patch('/api/admin/messages/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const normalizedStatus = typeof req.body?.status === 'string' ? req.body.status.toLowerCase() : '';
    const parseResult = adminItemStatusSchema.safeParse({ status: normalizedStatus });
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Allowed values: new, contacted, closed',
      });
    }

    const beforeRows = await query<any>('SELECT id, status FROM contact_messages WHERE id::text = $1', [id]);
    if (beforeRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const updated = await query<any>(
      `UPDATE contact_messages
       SET status = $1
       WHERE id::text = $2
       RETURNING id, name, email, subject, status`,
      [parseResult.data.status, id]
    );

    await logAudit('contact_message', id, 'update_status', beforeRows[0], updated[0]);

    return res.json({ success: true, data: updated[0] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to update message status' });
  }
});

// GET /api/admin/stats
app.get('/api/admin/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [orderCountRes, pendingCountRes, inProdCountRes, leadsCountRes, messagesCountRes, usersCountRes] =
      await Promise.all([
        query<{ count: string }>('SELECT COUNT(*)::text as count FROM orders'),
        query<{ count: string }>("SELECT COUNT(*)::text as count FROM orders WHERE LOWER(status) = 'pending'"),
        query<{ count: string }>("SELECT COUNT(*)::text as count FROM orders WHERE LOWER(status) = 'in_production'"),
        query<{ count: string }>("SELECT COUNT(*)::text as count FROM quote_leads WHERE LOWER(status) = 'new'"),
        query<{ count: string }>("SELECT COUNT(*)::text as count FROM contact_messages WHERE LOWER(status) = 'new'"),
        query<{ count: string }>('SELECT COUNT(*)::text as count FROM users'),
      ]);

    const stats = {
      totalOrders: Number(orderCountRes[0]?.count || 0),
      pendingOrders: Number(pendingCountRes[0]?.count || 0),
      ordersInProduction: Number(inProdCountRes[0]?.count || 0),
      newQuoteLeads: Number(leadsCountRes[0]?.count || 0),
      newMessages: Number(messagesCountRes[0]?.count || 0),
      totalCustomers: Number(usersCountRes[0]?.count || 0),
      grossBookings: null,
      csat: null,
    };

    return res.json({ success: true, data: stats });
  } catch (err: any) {
    logger.error({ err }, 'Admin get stats error');
    return res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
  }
});

// GET /api/admin/audit-logs
app.get('/api/admin/audit-logs', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      `SELECT id, entity, entity_id, action, before, after, created_at
       FROM audit_log
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return res.json({ success: true, data: rows });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve audit logs' });
  }
});

// --- Phase 6: Dynamic Content Management Endpoints ---

// Cache helper for public GET content
const setPublicCacheHeaders = (res: Response) => {
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
};

// GET /api/services
app.get('/api/services', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  try {
    const rows = await query<{ slug: string; data: any; sort_order: number }>(
      'SELECT slug, data, sort_order FROM services WHERE active = true ORDER BY sort_order ASC'
    );
    if (rows.length > 0) {
      const items = rows.map((r) => (typeof r.data === 'string' ? JSON.parse(r.data) : r.data));
      return res.json(items);
    }
  } catch (err) {
    logger.warn({ err }, 'Services query failed, falling back to static shared');
  }
  return res.json(SERVICES_CATALOG);
});

// GET /api/services/:slug
app.get('/api/services/:slug', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const { slug } = req.params;
  try {
    const rows = await query<{ slug: string; data: any }>(
      'SELECT slug, data FROM services WHERE slug = $1 AND active = true',
      [slug]
    );
    if (rows.length > 0) {
      const data = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      return res.json(data);
    }
  } catch (err) {
    logger.warn({ err }, 'Service detail query failed, falling back to static shared');
  }

  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  return res.json(service);
});

// Helper for generic content_items public queries
async function getContentItemsByKind(kind: string, fallbackData: any[]) {
  try {
    const rows = await query<{ data: any }>(
      'SELECT data FROM content_items WHERE kind = $1 AND active = true ORDER BY sort_order ASC, id ASC',
      [kind]
    );
    if (rows.length > 0) {
      return rows.map((r) => (typeof r.data === 'string' ? JSON.parse(r.data) : r.data));
    }
  } catch (err) {
    logger.warn({ err, kind }, 'Content item query failed, using static fallback');
  }
  return fallbackData;
}

// GET /api/stats
app.get('/api/stats', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('stat', STATS_DATA);
  return res.json(items);
});

// GET /api/awards
app.get('/api/awards', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('award', AWARDS_DATA);
  return res.json(items);
});

// GET /api/testimonials
app.get('/api/testimonials', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('testimonial', TESTIMONIALS_DATA);
  return res.json(items);
});

// GET /api/blog
app.get('/api/blog', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('blog', BLOG_POSTS_DATA);
  return res.json(items);
});

// GET /api/blog/:slug
app.get('/api/blog/:slug', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const { slug } = req.params;
  try {
    const rows = await query<{ data: any }>(
      'SELECT data FROM content_items WHERE kind = $1 AND slug = $2 AND active = true',
      ['blog', slug]
    );
    if (rows.length > 0) {
      const data = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
      return res.json(data);
    }
  } catch (err) {
    logger.warn({ err }, 'Blog post detail query failed, falling back to static');
  }

  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  return res.json(post);
});

// Default pricing plans fallback
const DEFAULT_PRICING_PLANS = [
  {
    id: 'pkg-personal-song',
    slug: 'pkg-personal-song',
    name: 'Personal Song',
    tagline: 'Ideal for intimate birthdays, proposals, and heartfelt anniversary gifts',
    price: 29,
    deliveryDays: 5,
    fastDeliveryDays: 2,
    revisions: 1,
    isPopular: false,
    deliverables: [
      'Original personalized lyrics based on your anecdotes',
      'Studio recorded single lead vocalist (Male or Female)',
      'Custom acoustic / pop musical backing arrangement',
      'Broadcast-quality MP3 (320kbps) master file',
      'Personal non-commercial listening & sharing license',
    ],
  },
  {
    id: 'pkg-cinematic-song',
    slug: 'pkg-cinematic-song',
    name: 'Cinematic Song',
    tagline: 'Our flagship tier for weddings, milestone anniversaries, and grand events',
    price: 59,
    deliveryDays: 4,
    fastDeliveryDays: 2,
    revisions: 2,
    isPopular: true,
    deliverables: [
      'Expanded multi-verse narrative storytelling',
      'Lead vocalist + background vocal harmonies & ad-libs',
      'Rich multi-instrumental arrangement (Piano, Strings, Drums, Guitars)',
      'High-Resolution 24-bit / 96kHz Lossless WAV + 320kbps MP3',
      'Commercial-grade album cover art featuring custom names',
      'Karaoke / Instrumental backing track included',
    ],
  },
  {
    id: 'pkg-signature-anthem',
    slug: 'pkg-signature-anthem',
    name: 'Signature Studio Anthem',
    tagline: 'The pinnacle production for luxury galas, legacy tributes, and brand launches',
    price: 99,
    deliveryDays: 3,
    fastDeliveryDays: 1,
    revisions: 3,
    isPopular: false,
    deliverables: [
      'Priority queue with Senior Berklee-trained composer',
      'Duet vocals or premium live acoustic instrumentation',
      'Dolby Atmos spatial audio mix + 24-bit 96kHz Master',
      'Complete raw stems archive (Vocals, Bass, Drums, Strings)',
      'Custom typography lyric video in 4K resolution (16:9 or 9:16)',
      'Unlimited lifetime global commercial sync license',
    ],
  },
];

// GET /api/pricing-plans
app.get('/api/pricing-plans', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('pricing_plan', DEFAULT_PRICING_PLANS);
  return res.json(items);
});

// Default FAQs fallback
const DEFAULT_FAQS = [
  {
    question: 'How does the custom song creation process work?',
    answer:
      'You provide stories, memories, genre references, and mood details through our Order Wizard. Our composers write original lyrics, produce the instrumental arrangement, record studio vocals, and deliver a broadcast-quality master.',
  },
  {
    question: 'Who owns the intellectual property and master rights?',
    answer:
      'You retain 100% full personal or commercial rights depending on your selected tier. There are never any backend royalties or subscription renewal fees.',
  },
  {
    question: 'What if I need adjustments after receiving my master track?',
    answer:
      'Every tier includes dedicated revision rounds. You can request lyrical tweaks, mix adjustments, or pacing changes directly through your project manager.',
  },
  {
    question: 'How fast can I receive an urgent song or video project?',
    answer:
      'Our Fast Track rush option prioritizes your brief with dedicated senior engineers, completing production in as few as 24 to 48 hours.',
  },
];

// GET /api/faqs
app.get('/api/faqs', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('faq', DEFAULT_FAQS);
  return res.json(items);
});

// Default How-It-Works steps fallback
const DEFAULT_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Creative Brief & Story Ingestion',
    subtitle: 'Extracting the emotional truth',
    description:
      'Whether filling out our customized song builder or submitting an episodic film script, we start by capturing your core memories, themes, genre references, and mandatory touchpoints.',
    details: [
      'Interactive online brief wizard',
      'Direct file attachment upload for photos, audio demos, or scripts',
      'Non-disclosure protection automatically in place',
    ],
  },
  {
    step: '02',
    title: 'Producer Discovery & Blueprinting',
    subtitle: 'Structuring the masterpiece',
    description:
      'Our lead lyricists, directors, or VFX supervisors analyze the brief. We compose thematic musical sketches, build mood reels, and draft shot lists tailored strictly to your goals.',
    details: [
      'Dedicated Producer assigned within 4 hours',
      'Lyrical drafting & tempo / key selection',
      'Moodboard & color palette confirmation',
    ],
  },
  {
    step: '03',
    title: 'Studio Recording & Production',
    subtitle: 'Capturing live energy',
    description:
      'Vocalists step up to the Neumann U87s, session musicians lay down acoustic guitars, or cinema cameras roll on our sound stages. We capture native 8K cinema footage and pristine 24-bit/96kHz audio.',
    details: [
      'Top-tier session vocalists (Male, Female, or Duet)',
      'Analog hardware tracking & live acoustics',
      'Cooke and Atlas Anamorphic optics for cinema footage',
    ],
  },
  {
    step: '04',
    title: 'Post-Production, VFX & Mastering',
    subtitle: 'Sculpting the final artifact',
    description:
      'Our editorial suites go to work: DaVinci Resolve color grading on calibrated HDR displays, precision audio vocal tuning and Dolby Atmos mastering, and seamless 3D visual effects compositing.',
    details: [
      'Radio-grade vocal editing and compression',
      'Pristine stereo & Dolby Atmos immersive mixes',
      'Photorealistic CG integration and cleanup',
    ],
  },
  {
    step: '05',
    title: 'Client Portal Private Screening',
    subtitle: 'Collaborative revision loop',
    description:
      'You receive a secure link to your private Legacy Pixels client dashboard. Stream high-fidelity master previews, leave exact timestamped feedback notes, and request included revisions.',
    details: [
      'Private cloud player (no lossy compression)',
      'Direct revision request interface',
      'Immediate notifications when updates are posted',
    ],
  },
];

// GET /api/how-it-works
app.get('/api/how-it-works', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  const items = await getContentItemsByKind('how_it_works', DEFAULT_HOW_IT_WORKS);
  return res.json(items);
});

// Default Site Settings fallback
const DEFAULT_SITE_SETTINGS: Record<string, any> = {
  site_name: 'Legacy Pixels',
  contact_email: 'production@legacypixels.net',
  contact_phone: '+1 (307) 200-8840',
  currency: 'USD',
  office_pakistan: 'Beside Faysal Bank, Daska Sambrail Road, Sialkot, Pakistan',
  office_usa: 'Suite C 1502 South Greely Highway, Cheyenne, Wyoming, USA',
  social_links: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    vimeo: 'https://vimeo.com',
    youtube: 'https://youtube.com',
  },
  footer_text: '© 2026 Legacy Pixels Advance Production House. All rights reserved.',
  hero_title: 'TURNING MEMORIES INTO CINEMATIC LEGACIES',
  hero_subtitle:
    'Award-winning bespoke music compositions, narrative cinema films, and high-impact visual effects.',
  cta_title: 'READY TO BRING YOUR STORY TO LIFE?',
  cta_subtitle:
    'Connect with our producers to begin your bespoke cinematic production.',
  about_philosophy_title: 'WHY LEGACY PIXELS EXISTS',
  about_philosophy_quote:
    'Every pixel, frame, and audio transient must honor the truth of the human experience.',
  about_philosophy_body:
    'Most modern content evaporates within twenty-four hours of publication. We reject disposable media. Whether directing a high-stakes commercial campaign or composing a customized song celebrating a couple’s 50th wedding anniversary, our guiding principle remains constant.',
};

// GET /api/settings
app.get('/api/settings', async (req: Request, res: Response) => {
  setPublicCacheHeaders(res);
  try {
    const rows = await query<{ key: string; value: any }>('SELECT key, value FROM site_settings');
    const settings = { ...DEFAULT_SITE_SETTINGS };
    for (const r of rows) {
      settings[r.key] = typeof r.value === 'string' ? JSON.parse(r.value) : r.value;
    }
    return res.json(settings);
  } catch (err) {
    logger.warn({ err }, 'Failed to query site settings, using default');
    return res.json(DEFAULT_SITE_SETTINGS);
  }
});

// --- Admin Content CRUD & Seeding (requireAdmin) ---

// POST /api/admin/seed (idempotent, only inserts where no row exists)
app.post('/api/admin/seed', requireAdmin, async (req: Request, res: Response) => {
  try {
    let seededServices = 0;
    let seededContent = 0;
    let seededSettings = 0;

    // 1. Seed Services
    for (let i = 0; i < SERVICES_CATALOG.length; i++) {
      const s = SERVICES_CATALOG[i];
      const existing = await query('SELECT slug FROM services WHERE slug = $1', [s.slug]);
      if (existing.length === 0) {
        await query(
          `INSERT INTO services (slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, true, $3, NOW())`,
          [s.slug, JSON.stringify(s), i + 1]
        );
        seededServices++;
      }
    }

    // 2. Seed Content Items: Stats
    for (let i = 0; i < STATS_DATA.length; i++) {
      const item = STATS_DATA[i];
      const slug = `stat-${item.id || i + 1}`;
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['stat', slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['stat', slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // Awards
    for (let i = 0; i < AWARDS_DATA.length; i++) {
      const item = AWARDS_DATA[i];
      const slug = `award-${item.id || i + 1}`;
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['award', slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['award', slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // Testimonials
    for (let i = 0; i < TESTIMONIALS_DATA.length; i++) {
      const item = TESTIMONIALS_DATA[i];
      const slug = `testimonial-${item.id || i + 1}`;
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['testimonial', slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['testimonial', slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // Blog
    for (let i = 0; i < BLOG_POSTS_DATA.length; i++) {
      const item = BLOG_POSTS_DATA[i];
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['blog', item.slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['blog', item.slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // Pricing plans
    for (let i = 0; i < DEFAULT_PRICING_PLANS.length; i++) {
      const item = DEFAULT_PRICING_PLANS[i];
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['pricing_plan', item.slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['pricing_plan', item.slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // FAQs
    for (let i = 0; i < DEFAULT_FAQS.length; i++) {
      const item = DEFAULT_FAQS[i];
      const slug = `faq-${i + 1}`;
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['faq', slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['faq', slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // How It Works
    for (let i = 0; i < DEFAULT_HOW_IT_WORKS.length; i++) {
      const item = DEFAULT_HOW_IT_WORKS[i];
      const slug = `step-${item.step}`;
      const existing = await query(
        'SELECT id FROM content_items WHERE kind = $1 AND slug = $2',
        ['how_it_works', slug]
      );
      if (existing.length === 0) {
        await query(
          `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
           VALUES ($1, $2, $3, true, $4, NOW())`,
          ['how_it_works', slug, JSON.stringify(item), i + 1]
        );
        seededContent++;
      }
    }

    // 3. Seed Site Settings
    for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
      const existing = await query('SELECT key FROM site_settings WHERE key = $1', [key]);
      if (existing.length === 0) {
        await query(
          `INSERT INTO site_settings (key, value, updated_at)
           VALUES ($1, $2, NOW())`,
          [key, JSON.stringify(value)]
        );
        seededSettings++;
      }
    }

    await logAudit('system', 'seed', 'import_seed_data', null, {
      seededServices,
      seededContent,
      seededSettings,
    });

    return res.json({
      success: true,
      message: 'Website data checked and initialized successfully.',
      seeded: {
        services: seededServices,
        contentItems: seededContent,
        siteSettings: seededSettings,
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Seed execution error');
    return res.status(500).json({ success: false, error: 'Failed to seed website data' });
  }
});

// Admin Services CRUD
app.get('/api/admin/services', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await query<any>(
      'SELECT slug, data, active, sort_order, updated_at FROM services ORDER BY sort_order ASC, slug ASC'
    );
    const services = rows.map((r) => ({
      slug: r.slug,
      active: r.active,
      sortOrder: r.sort_order,
      updatedAt: r.updated_at,
      data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    }));
    return res.json({ success: true, data: services });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve services' });
  }
});

const serviceEditSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  data: z.record(z.any()),
});

app.post('/api/admin/services', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parseResult = serviceEditSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.errors[0]?.message });
    }

    const { slug, active, sortOrder, data } = parseResult.data;

    // Check slug uniqueness
    const existing = await query('SELECT slug FROM services WHERE slug = $1', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'A service with this slug already exists.' });
    }

    await query(
      `INSERT INTO services (slug, data, active, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [slug, JSON.stringify(data), active, sortOrder]
    );

    await logAudit('service', slug, 'create', null, { slug, active, sortOrder });

    return res.status(201).json({ success: true, message: 'Service created successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to create service' });
  }
});

app.put('/api/admin/services/:slug', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, active, sortOrder } = req.body;

    const before = await query<any>('SELECT slug, data, active, sort_order FROM services WHERE slug = $1', [slug]);
    if (before.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    await query(
      `UPDATE services
       SET data = $1, active = $2, sort_order = $3, updated_at = NOW()
       WHERE slug = $4`,
      [JSON.stringify(data), active !== undefined ? active : true, sortOrder || 0, slug]
    );

    await logAudit('service', slug, 'update', before[0], { data, active, sortOrder });

    return res.json({ success: true, message: 'Service updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to update service' });
  }
});

app.patch('/api/admin/services/:slug/toggle', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { active } = req.body;

    const before = await query<any>('SELECT slug, active FROM services WHERE slug = $1', [slug]);
    if (before.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    await query('UPDATE services SET active = $1, updated_at = NOW() WHERE slug = $2', [Boolean(active), slug]);
    await logAudit('service', slug, 'toggle_active', before[0], { active: Boolean(active) });

    return res.json({ success: true, active: Boolean(active) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to toggle service' });
  }
});

// Admin Content Items CRUD
app.get('/api/admin/content-items', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { kind } = req.query;
    let sql = 'SELECT id, kind, slug, data, active, sort_order, updated_at FROM content_items';
    const params: any[] = [];
    if (kind && typeof kind === 'string') {
      sql += ' WHERE kind = $1';
      params.push(kind);
    }
    sql += ' ORDER BY kind ASC, sort_order ASC, id ASC';

    const rows = await query<any>(sql, params);
    const items = rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      slug: r.slug,
      active: r.active,
      sortOrder: r.sort_order,
      updatedAt: r.updated_at,
      data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    }));

    return res.json({ success: true, data: items });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve content items' });
  }
});

app.post('/api/admin/content-items', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { kind, slug, data, active, sortOrder } = req.body;
    if (!kind || !data) {
      return res.status(400).json({ success: false, error: 'Kind and data are required' });
    }

    const inserted = await query<any>(
      `INSERT INTO content_items (kind, slug, data, active, sort_order, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, kind, slug, active, sort_order`,
      [kind, slug || null, JSON.stringify(data), active !== false, sortOrder || 0]
    );

    await logAudit('content_item', inserted[0].id, 'create', null, inserted[0]);

    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to create content item' });
  }
});

app.put('/api/admin/content-items/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slug, data, active, sortOrder } = req.body;

    const before = await query<any>('SELECT id, kind, slug, data, active, sort_order FROM content_items WHERE id = $1', [id]);
    if (before.length === 0) {
      return res.status(404).json({ success: false, error: 'Content item not found' });
    }

    await query(
      `UPDATE content_items
       SET slug = $1, data = $2, active = $3, sort_order = $4, updated_at = NOW()
       WHERE id = $5`,
      [slug || null, JSON.stringify(data), active !== false, sortOrder || 0, id]
    );

    await logAudit('content_item', id, 'update', before[0], { slug, data, active, sortOrder });

    return res.json({ success: true, message: 'Content item updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to update content item' });
  }
});

app.delete('/api/admin/content-items/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const before = await query<any>('SELECT id, kind, slug, data FROM content_items WHERE id = $1', [id]);
    if (before.length === 0) {
      return res.status(404).json({ success: false, error: 'Content item not found' });
    }

    await query('DELETE FROM content_items WHERE id = $1', [id]);
    await logAudit('content_item', id, 'delete', before[0], null);

    return res.json({ success: true, message: 'Content item deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to delete content item' });
  }
});

// Admin Site Settings CRUD
app.get('/api/admin/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await query<{ key: string; value: any }>('SELECT key, value FROM site_settings');
    const settings = { ...DEFAULT_SITE_SETTINGS };
    for (const r of rows) {
      settings[r.key] = typeof r.value === 'string' ? JSON.parse(r.value) : r.value;
    }
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve settings' });
  }
});

app.put('/api/admin/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({ success: false, error: 'Settings object is required' });
    }

    for (const [key, value] of Object.entries(newSettings)) {
      const before = await query<{ value: any }>('SELECT value FROM site_settings WHERE key = $1', [key]);
      await query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, JSON.stringify(value)]
      );
      await logAudit('site_setting', key, 'update', before[0]?.value || null, value);
    }

    return res.json({ success: true, message: 'Site settings updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err }, 'Unhandled API error');
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`Legacy Pixels Server running on http://localhost:${PORT}`);
  });
}

export default app;