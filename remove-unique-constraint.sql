-- ============================================
-- MIGRATION: Remove Unique Constraint from Reservations
-- Purpose: Allow multiple PIX contributions for open value gifts
-- ============================================

-- Remove unique constraint on reservations.gift_id
-- This allows multiple users to contribute to the same open value gift
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_gift_id_key;

-- Verify constraint was removed
SELECT 
  conname as constraint_name, 
  contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'reservations'::regclass;

-- Expected result: The reservations_gift_id_key constraint should NOT appear in the results

-- ============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================
-- If you need to rollback this change, run:
-- ALTER TABLE reservations ADD CONSTRAINT reservations_gift_id_key UNIQUE (gift_id);
