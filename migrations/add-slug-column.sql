-- Migration to add slug column to properties table
-- Run this SQL in your database to add the slug column

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

