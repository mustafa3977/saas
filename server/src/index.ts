import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmetImport from 'helmet';
import rateLimitImport from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { pino } from 'pino';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import {
  SERVICES_CATALOG,
  STATS_DATA,
  AWARDS_DATA,
  TESTIMONIALS_DATA,
  BLOG_POSTS_DATA,
  quoteLeadSchema,
  contactMessageSchema,
  createOrderDraftSchema,
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
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
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

    // Throttling: max 5 failed attempts per email + IP per 10 minutes
    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please try again in 10 minutes.',
      });
    }

    // Check duplicate email
    const existingUsers = await query<{ id: number }>(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingUsers.length > 0) {
      await recordFailedAttempt(throttleKey);
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user (never accept role from client, default is standard customer)
    const newUsers = await query<{ id: number; name: string; email: string }>(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    const newUser = newUsers[0];
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

    // Throttling: max 5 failed attempts per email + IP per 10 minutes
    const throttled = await isThrottled(throttleKey, 5, 10);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please try again in 10 minutes.',
      });
    }

    const users = await query<{ id: number; name: string; email: string; password_hash: string }>(
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

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const users = await query<{ id: number; name: string; email: string; created_at: string }>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = users[0];
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    logger.error({ err }, 'Auth me error');
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile',
    });
  }
});

// --- Admin Endpoints (Password only, no database for credentials) ---

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

    // Throttling: 5 failed attempts per IP per 15 minutes, then lock for 15 minutes
    const throttled = await isThrottled(throttleKey, 5, 15);
    if (throttled) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Locked for 15 minutes.',
      });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      await recordFailedAttempt(throttleKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    await clearAttempts(throttleKey);

    const token = generateAdminToken();

    return res.json({
      success: true,
      token,
      role: 'admin',
    });
  } catch (err: any) {
    logger.error({ err }, 'Admin login error');
    return res.status(500).json({
      success: false,
      error: 'Admin login failed',
    });
  }
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  return res.json({
    success: true,
    role: 'admin',
  });
});

// Services Catalog API
app.get('/api/services', (req: Request, res: Response) => {
  res.json({ success: true, data: SERVICES_CATALOG });
});

app.get('/api/services/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) {
    return res.status(404).json({ success: false, error: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// Marketing Content APIs
app.get('/api/stats', (req: Request, res: Response) => {
  res.json({ success: true, data: STATS_DATA });
});

app.get('/api/awards', (req: Request, res: Response) => {
  res.json({ success: true, data: AWARDS_DATA });
});

app.get('/api/testimonials', (req: Request, res: Response) => {
  res.json({ success: true, data: TESTIMONIALS_DATA });
});

app.get('/api/blog', (req: Request, res: Response) => {
  res.json({ success: true, data: BLOG_POSTS_DATA });
});

app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Blog post not found' });
  }
  res.json({ success: true, data: post });
});

// Quote Leads (Stays public)
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const validatedData = quoteLeadSchema.parse(req.body);
    logger.info({ lead: validatedData }, 'New Quote Lead Received');
    return res.status(201).json({
      success: true,
      message: 'Thank you for your project brief. A producer will contact you within 24 hours.',
      leadId: `lead_${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// Contact Form Message (Stays public)
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const validatedData = contactMessageSchema.parse(req.body);
    logger.info({ contact: validatedData }, 'Contact Message Received');
    return res.status(200).json({
      success: true,
      message: 'Message delivered. The Legacy Pixels production desk will be in touch shortly.',
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// Draft Order Initialization - Requires Customer Auth
app.post('/api/orders/draft', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderDraftSchema.parse(req.body);
    const orderNumber = `LP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    logger.info({ orderNumber, service: validatedData.serviceSlug, userId: req.user?.id }, 'Order Draft Created');

    // Save order linked to user
    await query(
      `INSERT INTO orders (user_id, order_number, service_slug, payload, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id,
        orderNumber,
        validatedData.serviceSlug,
        JSON.stringify(validatedData),
        'draft',
      ]
    );

    return res.status(201).json({
      success: true,
      orderNumber,
      message: 'Draft order initialized successfully.',
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
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