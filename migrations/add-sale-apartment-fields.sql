-- Migration: Add Sale/Apartment-specific fields (New property or Resale, Total Flats, Flats on Floor)
-- Run this SQL in your database to add the columns

ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_resale BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_flats INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS flats_on_floor INTEGER;
