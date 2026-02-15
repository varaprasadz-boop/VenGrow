-- Add roles array column for dual buyer/seller (Fiverr-style) support.
-- Backfill: set roles = ARRAY[role] for existing users so behavior is unchanged.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS roles TEXT[];

-- Backfill: one role per user from existing role column
UPDATE users
SET roles = ARRAY[role::text]
WHERE roles IS NULL OR array_length(roles, 1) IS NULL;
