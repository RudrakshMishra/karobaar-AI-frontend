-- TABLE 1: USERS (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  gst_number TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' 
    CHECK (plan IN ('free','pro','agency')),
  plan_expires_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  monthly_revenue_goal NUMERIC(12,2) DEFAULT 500000,
  target_margin_percent NUMERIC(5,2) DEFAULT 20,
  primary_platform TEXT DEFAULT 'amazon'
    CHECK (primary_platform IN ('amazon','flipkart','meesho',
    'shopify','woocommerce','other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: COST DEFAULTS (per user)
CREATE TABLE public.cost_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform_fee_percent NUMERIC(5,2) DEFAULT 15,
  avg_shipping_cost NUMERIC(8,2) DEFAULT 60,
  packaging_cost NUMERIC(8,2) DEFAULT 20,
  monthly_ads_budget NUMERIC(10,2) DEFAULT 5000,
  cod_return_rate_percent NUMERIC(5,2) DEFAULT 18,
  gst_percent NUMERIC(5,2) DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- TABLE 3: CONNECTED PLATFORMS
CREATE TABLE public.connected_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL 
    CHECK (platform IN ('amazon','flipkart','meesho',
    'shopify','woocommerce','csv')),
  status TEXT DEFAULT 'connected' 
    CHECK (status IN ('connected','error','disconnected')),
  api_key_encrypted TEXT,
  shop_url TEXT,
  last_sync_at TIMESTAMPTZ,
  total_orders_synced INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: ORDERS (core data)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  external_order_id TEXT,
  order_date DATE NOT NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  selling_price NUMERIC(10,2) NOT NULL,
  platform TEXT NOT NULL,
  is_return BOOLEAN DEFAULT FALSE,
  platform_fee NUMERIC(10,2),
  shipping_cost NUMERIC(10,2),
  packaging_cost NUMERIC(10,2),
  ads_cost_allocated NUMERIC(10,2),
  gst_amount NUMERIC(10,2),
  net_profit NUMERIC(10,2),
  profit_margin_percent NUMERIC(5,2),
  import_batch_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_user_date ON public.orders(user_id, order_date);
CREATE INDEX idx_orders_product ON public.orders(user_id, product_name);
CREATE INDEX idx_orders_platform ON public.orders(user_id, platform);

-- TABLE 5: PRODUCTS (aggregated view)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  current_price NUMERIC(10,2),
  suggested_price NUMERIC(10,2),
  current_stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  platform TEXT,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  total_units_sold INTEGER DEFAULT 0,
  total_profit NUMERIC(12,2) DEFAULT 0,
  avg_margin_percent NUMERIC(5,2) DEFAULT 0,
  return_rate_percent NUMERIC(5,2) DEFAULT 0,
  daily_sales_rate NUMERIC(8,2) DEFAULT 0,
  days_of_stock_remaining INTEGER,
  last_sale_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name, platform)
);
CREATE INDEX idx_products_user ON public.products(user_id);
CREATE INDEX idx_products_stock ON public.products(user_id, current_stock);

-- TABLE 6: CSV IMPORT BATCHES
CREATE TABLE public.import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'processing'
    CHECK (status IN ('processing','completed','failed')),
  total_rows INTEGER DEFAULT 0,
  processed_rows INTEGER DEFAULT 0,
  error_rows INTEGER DEFAULT 0,
  date_range_start DATE,
  date_range_end DATE,
  platforms_detected TEXT[],
  error_log JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 7: AI SUGGESTIONS
CREATE TABLE public.ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL 
    CHECK (type IN ('opportunity','warning','urgent','info')),
  priority TEXT NOT NULL 
    CHECK (priority IN ('high','medium','low')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_text TEXT,
  related_product_id UUID REFERENCES public.products(id),
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active','applied','dismissed','expired')),
  applied_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_suggestions_user_active 
  ON public.ai_suggestions(user_id, status, created_at DESC);

-- TABLE 8: AI CHAT CONVERSATIONS
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 9: CHAT MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL 
    REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation 
  ON public.messages(conversation_id, created_at ASC);

-- TABLE 10: COMPETITORS
CREATE TABLE public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  competitor_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  competitor_name TEXT,
  competitor_price NUMERIC(10,2),
  competitor_rating NUMERIC(3,2),
  competitor_reviews INTEGER,
  your_price NUMERIC(10,2),
  price_difference NUMERIC(10,2),
  price_difference_percent NUMERIC(5,2),
  ai_insight TEXT,
  last_checked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' 
    CHECK (status IN ('active','paused','error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 11: BUSINESS HEALTH SCORES
CREATE TABLE public.health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  profit_score INTEGER NOT NULL,
  marketing_score INTEGER NOT NULL,
  pricing_score INTEGER NOT NULL,
  inventory_score INTEGER NOT NULL,
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- TABLE 12: PRICING HISTORY
CREATE TABLE public.pricing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  old_price NUMERIC(10,2),
  new_price NUMERIC(10,2),
  change_reason TEXT,
  changed_by TEXT DEFAULT 'manual' 
    CHECK (changed_by IN ('manual','ai_suggestion','bulk')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 13: SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free','pro','agency')),
  status TEXT DEFAULT 'active' 
    CHECK (status IN ('active','cancelled','expired','trial')),
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  amount_paid NUMERIC(10,2),
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly' 
    CHECK (billing_cycle IN ('monthly','annual')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 14: NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_unread 
  ON public.notifications(user_id, is_read, created_at DESC);

-- TABLE 15: WEEKLY DIGESTS
CREATE TABLE public.weekly_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_revenue NUMERIC(12,2),
  total_profit NUMERIC(12,2),
  total_orders INTEGER,
  best_product TEXT,
  worst_product TEXT,
  ai_narrative TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- ROW LEVEL SECURITY: Enable on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_digests ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: Users can only access their own data
CREATE POLICY "Users own data" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own cost_defaults" ON public.cost_defaults FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own products" ON public.products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own suggestions" ON public.ai_suggestions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own messages" ON public.messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own competitors" ON public.competitors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own import_batches" ON public.import_batches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own connected_platforms" ON public.connected_platforms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own health_scores" ON public.health_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own pricing_history" ON public.pricing_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own weekly_digests" ON public.weekly_digests FOR ALL USING (auth.uid() = user_id);

-- AUTO UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cost_defaults_updated_at BEFORE UPDATE ON public.cost_defaults FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_connected_platforms_updated_at BEFORE UPDATE ON public.connected_platforms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_import_batches_updated_at BEFORE UPDATE ON public.import_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON public.competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
