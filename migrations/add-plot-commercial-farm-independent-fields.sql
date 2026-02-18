-- Migration: Add independent_house to property_type enum and Plot/Farm-specific columns
-- Run this SQL in your database

-- Add new value to property_type enum (run separately if your PG version requires it)
-- For PostgreSQL < 15, remove IF NOT EXISTS or run this line separately
ALTER TYPE property_type ADD VALUE 'independent_house';

-- Plot-specific columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_length INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_breadth INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_corner_plot BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_width_plot_meters INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS club_house_available BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_allowed_construction INTEGER;

-- Farmhouse-specific columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS soil_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fencing BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_source TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_clear BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS farm_house BOOLEAN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS approach_road_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_from_nearest_town TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS farm_project_name TEXT;
