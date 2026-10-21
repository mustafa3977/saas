export type UserRole =
  | 'customer'
  | 'producer'
  | 'team_leader'
  | 'qc_reviewer'
  | 'manager'
  | 'finance'
  | 'admin';

export type Locale = 'en' | 'ur' | 'ar' | 'es';

export type ServiceSlug =
  | 'movies'
  | 'music'
  | 'vfx'
  | 'editing'
  | 'branding'
  | 'ads-motion-graphics'
  | 'livestream-production'
  | 'photography-social-content';

export type FulfillmentStatus =
  | 'DRAFT'
  | 'AWAITING_BRIEF'
  | 'READY'
  | 'IN_PRODUCTION'
  | 'QUALITY_REVIEW'
  | 'CUSTOMER_REVIEW'
  | 'WAITING_CUSTOMER'
  | 'REVISION_REQUESTED'
  | 'IN_REVISION'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'refunded'
  | 'partially_refunded'
  | 'disputed';

export interface LocalizedString {
  en: string;
  ur?: string;
  ar?: string;
  es?: string;
}

export interface ServicePackage {
  id: string;
  slug: string;
  name: LocalizedString;
  tagline?: LocalizedString;
  priceCents: number;
  deliveryDays: number;
  fastDeliveryDays: number;
  includedRevisions: number;
  deliverables: string[];
  features: string[];
  isPopular?: boolean;
  checkoutEnabled: boolean;
}

export interface ServiceAddon {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  priceCents: number;
  type: 'fast_delivery' | 'extra_revision' | 'custom';
  enabled: boolean;
}

export interface ServiceOccasion {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  isPopular?: boolean;
}

export interface FAQItem {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface ProcessStep {
  step: number;
  title: LocalizedString;
  description: LocalizedString;
}

export interface SampleItem {
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
}

export interface BriefFormField {
  id: string;
  label: LocalizedString;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'file';
  placeholder?: LocalizedString;
  required: boolean;
  options?: { value: string; label: LocalizedString }[];
}

export interface ServiceDefinition {
  id: string;
  slug: ServiceSlug;
  title: LocalizedString;
  tagline: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  iconName: string;
  heroImage: string;
  checkoutEnabled: boolean;
  startingPriceCents: number;
  packages: ServicePackage[];
  addons: ServiceAddon[];
  occasions?: ServiceOccasion[];
  whatIsIncluded: string[];
  processSteps: ProcessStep[];
  faq: FAQItem[];
  samples: SampleItem[];
  briefFields: BriefFormField[];
}

export interface MusicBrief {
  occasion: string;
  customOccasion?: string;
  recipientName: string;
  pronunciationNotes?: string;
  relationship?: string;
  storyDetails: string;
  mustIncludeWords?: string;
  avoidWords?: string;
  genre: string;
  mood: string;
  vocalPreference: 'male' | 'female' | 'duet' | 'no_preference';
  songLanguage: 'english' | 'urdu' | 'punjabi' | 'spanish' | 'arabic' | string;
  eventDate?: string;
  albumTheme?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  visualStyleNotes?: string;
  referenceLinks?: string[];
}

export interface OrderItem {
  packageId: string;
  packageName: string;
  priceCents: number;
  fastDelivery: boolean;
  fastDeliveryPriceCents: number;
  additionalRevisionsCount: number;
  additionalRevisionUnitPriceCents: number;
  addons: {
    addonId: string;
    name: string;
    priceCents: number;
  }[];
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone?: string;
  agreedToTerms: boolean;
  agreedToRights: boolean;
  optInMarketing?: boolean;
  optInPortfolio?: boolean;
}

export interface OrderData {
  id?: string;
  publicNumber: string;
  customerId?: string;
  serviceSlug: ServiceSlug;
  packageId: string;
  item: OrderItem;
  brief: Record<string, any>;
  customer: OrderCustomerInfo;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  estimatedDeliveryDate?: string;
}

export interface BlogPost {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: string;
  category: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: LocalizedString;
}

export interface AwardItem {
  id: string;
  laurelTitle: string;
  laurelYear: string;
  laurelOrg: string;
  portfolioCardTitle: string;
  starRating: number;
  runtime: string;
  coverImage: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export interface QuoteLead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  serviceSlug: ServiceSlug;
  budgetRange?: string;
  projectTimeline?: string;
  message: string;
  createdAt?: string;
}
