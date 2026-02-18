-- Migration: Add Joint Venture details column for JV/development listings
ALTER TABLE properties ADD COLUMN IF NOT EXISTS jv_details JSONB;
