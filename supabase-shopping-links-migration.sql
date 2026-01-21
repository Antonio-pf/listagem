-- Shopping Links Integration - Database Migration
-- Run this in your Supabase SQL Editor after the initial setup

-- ============================================
-- 1. CREATE SHOPPING_LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shopping_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id TEXT NOT NULL,
  store TEXT NOT NULL CHECK (store IN ('mercado-livre', 'amazon', 'magalu')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10, 2),
  image_url TEXT,
  rating DECIMAL(3, 1),
  generated_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopping_links_gift_id ON shopping_links(gift_id);
CREATE INDEX IF NOT EXISTS idx_shopping_links_store ON shopping_links(store);
CREATE INDEX IF NOT EXISTS idx_shopping_links_created_at ON shopping_links(created_at DESC);

-- ============================================
-- 2. CREATE RATE_LIMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON rate_limits(created_at DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE shopping_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES FOR SHOPPING_LINKS
-- ============================================
DROP POLICY IF EXISTS "Enable read access for all users" ON shopping_links;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON shopping_links;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON shopping_links;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON shopping_links;

-- Allow anyone to read shopping links
CREATE POLICY "Enable read access for all users" ON shopping_links
FOR SELECT USING (true);

-- Allow anyone to insert shopping links (API will handle rate limiting)
CREATE POLICY "Enable insert for authenticated users" ON shopping_links
FOR INSERT WITH CHECK (true);

-- Allow anyone to update shopping links
CREATE POLICY "Enable update for authenticated users" ON shopping_links
FOR UPDATE USING (true);

-- Allow anyone to delete shopping links
CREATE POLICY "Enable delete for authenticated users" ON shopping_links
FOR DELETE USING (true);

-- ============================================
-- 5. CREATE RLS POLICIES FOR RATE_LIMITS
-- ============================================
DROP POLICY IF EXISTS "Enable all access for rate_limits" ON rate_limits;

-- Allow all operations on rate_limits (used internally by API)
CREATE POLICY "Enable all access for rate_limits" ON rate_limits
FOR ALL USING (true);

-- ============================================
-- 6. CREATE FUNCTION TO CLEAN OLD RATE LIMITS
-- ============================================
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. CREATE FUNCTION TO CLEAN OLD SHOPPING LINKS
-- ============================================
CREATE OR REPLACE FUNCTION clean_old_shopping_links()
RETURNS void AS $$
BEGIN
  DELETE FROM shopping_links
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. VERIFY SETUP
-- ============================================
SELECT 'Shopping Links migration complete!' as status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('shopping_links', 'rate_limits');

-- Check columns in shopping_links table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'shopping_links'
ORDER BY ordinal_position;

-- Check columns in rate_limits table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'rate_limits'
ORDER BY ordinal_position;
