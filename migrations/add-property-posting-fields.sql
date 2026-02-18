-- Migration: Add Property Posting Details (Excel spec) fields to properties table
-- Run this SQL in your database to add the columns

ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_landmark TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS super_built_up_area INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS car_parking_count INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS maintenance_charges INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS view_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS number_of_lifts INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS security_deposit INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lock_in_months INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenants_preferred TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS negotiable_rent TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brokerage_both_sides TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS disclosure TEXT;
