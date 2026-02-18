-- Migration: Add pg_co_living to property_type enum and PG/Co-living columns
-- Run this SQL in your database

ALTER TYPE property_type ADD VALUE 'pg_co_living';

ALTER TABLE properties ADD COLUMN IF NOT EXISTS co_living_name TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_gender TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_listed_for TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_room_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_available_in TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_furnishing_details TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_ac_available BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_wash_room_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_facilities JSONB;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_rules JSONB;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_cctv BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_biometric_entry BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_security_guard BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_services JSONB;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_food_provided BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_non_veg_provided BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pg_notice_period TEXT;
