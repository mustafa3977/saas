import { z } from 'zod';

export const musicBriefSchema = z.object({
  occasion: z.string().min(1, 'Please select an occasion'),
  customOccasion: z.string().optional(),
  recipientName: z.string().min(1, 'Recipient name is required'),
  pronunciationNotes: z.string().optional(),
  relationship: z.string().optional(),
  storyDetails: z.string().min(15, 'Please provide at least 15 characters of memories or details'),
  mustIncludeWords: z.string().optional(),
  avoidWords: z.string().optional(),
  genre: z.string().min(1, 'Please select a musical genre/style'),
  mood: z.string().min(1, 'Please select a mood'),
  vocalPreference: z.enum(['male', 'female', 'duet', 'no_preference']),
  songLanguage: z.string().min(1, 'Please select a language for the song'),
  eventDate: z.string().optional(),
  albumTheme: z.string().optional(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).optional(),
  visualStyleNotes: z.string().optional(),
  referenceLinks: z.array(z.string().url()).optional(),
});

export const orderCustomerInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the Terms of Service'),
  agreedToRights: z.boolean().refine((val) => val === true, 'You must confirm ownership/rights of uploaded materials'),
  optInMarketing: z.boolean().optional(),
  optInPortfolio: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  packageId: z.string().min(1),
  packageName: z.string().min(1),
  priceCents: z.number().int().positive(),
  fastDelivery: z.boolean(),
  fastDeliveryPriceCents: z.number().int().nonnegative(),
  additionalRevisionsCount: z.number().int().nonnegative(),
  additionalRevisionUnitPriceCents: z.number().int().nonnegative(),
  addons: z.array(
    z.object({
      addonId: z.string(),
      name: z.string(),
      priceCents: z.number().int().positive(),
    })
  ),
});

export const createOrderDraftSchema = z.object({
  serviceSlug: z.enum([
    'movies',
    'music',
    'vfx',
    'editing',
    'branding',
    'ads-motion-graphics',
    'livestream-production',
    'photography-social-content',
  ]),
  packageId: z.string().min(1),
  item: orderItemSchema,
  brief: z.record(z.any()),
  customer: orderCustomerInfoSchema,
});

export const quoteLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  serviceSlug: z.enum([
    'movies',
    'music',
    'vfx',
    'editing',
    'branding',
    'ads-motion-graphics',
    'livestream-production',
    'photography-social-content',
  ]),
  budgetRange: z.string().optional(),
  projectTimeline: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters detailing your project'),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'in_production',
  'quality_review',
  'customer_review',
  'completed',
  'cancelled',
]);

export const createOrderSchema = z.object({
  serviceSlug: z.string().min(1),
  packageId: z.string().min(1),
  item: z.object({
    packageId: z.string().min(1),
    packageName: z.string().optional(),
    fastDelivery: z.boolean().default(false),
    additionalRevisionsCount: z.number().int().nonnegative().default(0),
    addons: z
      .array(
        z.object({
          addonId: z.string(),
          name: z.string().optional(),
          priceCents: z.number().optional(),
        })
      )
      .default([]),
  }),
  brief: z.record(z.any()),
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    agreedToTerms: z.boolean().optional(),
    agreedToRights: z.boolean().optional(),
    optInMarketing: z.boolean().optional(),
  }),
  notes: z.string().optional(),
});

