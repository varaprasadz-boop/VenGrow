-- Migration: Add Villa-specific fields (Total Villas, Corner Property, Road width, Lifts Available)
-- Run this SQL in your database to add the columns

ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_villas INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_corner_property BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_width_feet INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lifts_available BOOLEAN;
