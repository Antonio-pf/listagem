-- Supabase Complete Setup SQL
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This script creates all necessary tables, indexes, and policies

-- ============================================
-- 1. CREATE GUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster name lookups
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);

-- ============================================
-- 2. CREATE RESERVATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id TEXT NOT NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  contribution_type TEXT NOT NULL DEFAULT 'physical',
  gift_price DECIMAL(10, 2),
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gift_id),  -- Ensures only one reservation per gift
  CHECK (contribution_type IN ('physical', 'pix'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_gift_id ON reservations(gift_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_contribution_type ON reservations(contribution_type);

-- ============================================
-- 3. CREATE MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- 4. CREATE GIFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2),
  is_open_value BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (category IN ('Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Limpeza', 'Outros'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_gifts_category ON gifts(category);
CREATE INDEX IF NOT EXISTS idx_gifts_name ON gifts(name);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. DROP EXISTING POLICIES (if any)
-- ============================================
DROP POLICY IF EXISTS "Enable read access for all users" ON guests;
DROP POLICY IF EXISTS "Enable insert for all users" ON guests;
DROP POLICY IF EXISTS "Enable read access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable insert for all users" ON reservations;
DROP POLICY IF EXISTS "Enable delete for all users" ON reservations;
DROP POLICY IF EXISTS "Enable read access for all users" ON messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON gifts;
DROP POLICY IF EXISTS "Enable insert for all users" ON gifts;
DROP POLICY IF EXISTS "Enable update for all users" ON gifts;
DROP POLICY IF EXISTS "Enable delete for all users" ON gifts;

-- ============================================
-- 7. CREATE RLS POLICIES FOR GUESTS
-- ============================================
CREATE POLICY "Enable read access for all users" ON guests
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON guests
FOR INSERT WITH CHECK (true);

-- ============================================
-- 8. CREATE RLS POLICIES FOR RESERVATIONS
-- ============================================
CREATE POLICY "Enable read access for all users" ON reservations
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON reservations
FOR DELETE USING (true);

-- ============================================
-- 9. CREATE RLS POLICIES FOR MESSAGES
-- ============================================
CREATE POLICY "Enable read access for all users" ON messages
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON messages
FOR INSERT WITH CHECK (true);

-- ============================================
-- 10. CREATE RLS POLICIES FOR GIFTS
-- ============================================
CREATE POLICY "Enable read access for all users" ON gifts
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON gifts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON gifts
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON gifts
FOR DELETE USING (true);

-- ============================================
-- 11. VERIFY SETUP
-- ============================================
SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('guests', 'reservations', 'messages', 'gifts');

-- Check columns in reservations table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'reservations'
ORDER BY ordinal_position;
