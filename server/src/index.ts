import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmetImport from 'helmet';
import rateLimitImport from 'express-rate-limit';

import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import { pino } from 'pino';
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
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'https://legacypixels.net'],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET || 'lp_cookie_secret_dev'));
app.use(express.json({ limit: '1mb' }));

// Rate limiter for general public API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Legacy Pixels API',
    version: '1.0.0',
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

// Quote Leads (For the 7 services where checkoutEnabled is false)
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const validatedData = quoteLeadSchema.parse(req.body);
    logger.info({ lead: validatedData }, 'New Quote Lead Received');
    // In later phases, save to MongoDB collection and enqueue notification email
    return res.status(201).json({
      success: true,
      message: 'Thank you for your project brief. A producer will contact you within 24 hours.',
      leadId: `lead_${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.errors || err.message });
  }
});

// Contact Form Message
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

// Draft Order Initialization (Phase 2 & Phase 5 support)
app.post('/api/orders/draft', (req: Request, res: Response) => {
  try {
    const validatedData = createOrderDraftSchema.parse(req.body);
    const orderNumber = `LP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    logger.info({ orderNumber, service: validatedData.serviceSlug }, 'Order Draft Created');

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