-- Legacy Pixels Database Schema V4 for Neon Postgres
-- Safe for direct execution in Neon SQL Editor (idempotent)

-- 1. USERS table updates
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'password';

-- 2. ORDERS table updates
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Update existing rows from draft or submitted to pending
UPDATE orders SET status = 'pending' WHERE status IN ('draft', 'submitted');

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC);

-- 3. QUOTE LEADS table
CREATE TABLE IF NOT EXISTS quote_leads (
  id SERIAL PRIMARY KEY,
  service_slug TEXT,
  name TEXT,
  email TEXT,
  payload JSONB,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_leads_status ON quote_leads(status);
CREATE INDEX IF NOT EXISTS idx_quote_leads_created_at ON quote_leads(created_at DESC);

-- 4. CONTACT MESSAGES table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- 5. SERVICES table
CREATE TABLE IF NOT EXISTS services (
  slug TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTENT ITEMS table (for kinds: stat, award, testimonial, blog, pricing_plan, faq, how_it_works)
CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT,
  data JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (kind, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_items_kind_active ON content_items(kind, active, sort_order);

-- 7. SITE SETTINGS table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOG table
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  entity TEXT,
  entity_id TEXT,
  action TEXT,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
