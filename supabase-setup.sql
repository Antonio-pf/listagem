-- Supabase Setup SQL
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster name lookups
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id TEXT NOT NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gift_id)  -- Ensures only one reservation per gift
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_gift_id ON reservations(gift_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest_id ON reservations(guest_id);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON guests;
DROP POLICY IF EXISTS "Enable insert for all users" ON guests;
DROP POLICY IF EXISTS "Enable read access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable insert for all users" ON reservations;
DROP POLICY IF EXISTS "Enable delete for all users" ON reservations;

-- Create RLS policies for guests
CREATE POLICY "Enable read access for all users" ON guests
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON guests
FOR INSERT WITH CHECK (true);

-- Create RLS policies for reservations
CREATE POLICY "Enable read access for all users" ON reservations
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON reservations
FOR DELETE USING (true);

-- Verify tables were created
SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('guests', 'reservations');
