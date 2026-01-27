-- Create event_attendance table for tracking guest attendance confirmations
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  will_attend BOOLEAN NOT NULL,
  companion_count INTEGER DEFAULT 0 CHECK (companion_count >= 0),
  dietary_restrictions TEXT,
  additional_notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guest_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_attendance_guest_id ON event_attendance(guest_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_confirmed_at ON event_attendance(confirmed_at);
CREATE INDEX IF NOT EXISTS idx_event_attendance_will_attend ON event_attendance(will_attend);

-- Enable Row Level Security
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for guest access
-- Guests can view their own attendance record
CREATE POLICY "Guests can view own attendance" ON event_attendance
  FOR SELECT
  USING (guest_id = auth.uid() OR guest_id IN (
    SELECT id FROM guests WHERE id = guest_id
  ));

-- Guests can insert their own attendance record
CREATE POLICY "Guests can insert own attendance" ON event_attendance
  FOR INSERT
  WITH CHECK (guest_id IN (
    SELECT id FROM guests WHERE id = guest_id
  ));

-- Guests can update their own attendance record
CREATE POLICY "Guests can update own attendance" ON event_attendance
  FOR UPDATE
  USING (guest_id IN (
    SELECT id FROM guests WHERE id = guest_id
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_event_attendance_updated_at_trigger
  BEFORE UPDATE ON event_attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendance_updated_at();

-- Add comments for documentation
COMMENT ON TABLE event_attendance IS 'Stores guest attendance confirmations for the event';
COMMENT ON COLUMN event_attendance.guest_id IS 'Reference to the guest confirming attendance';
COMMENT ON COLUMN event_attendance.will_attend IS 'Whether the guest will attend the event';
COMMENT ON COLUMN event_attendance.companion_count IS 'Number of companions attending with the guest';
COMMENT ON COLUMN event_attendance.dietary_restrictions IS 'Any dietary restrictions or requirements';
COMMENT ON COLUMN event_attendance.additional_notes IS 'Additional notes or comments from the guest';
