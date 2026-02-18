-- Migration: Add New Project category-specific fields (Property Type: New Project)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS new_project_category TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS new_project_floor_plans JSONB;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS new_project_dimensions JSONB;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_in_locality TEXT;
