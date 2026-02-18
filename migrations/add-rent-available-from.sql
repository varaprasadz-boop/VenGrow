-- Migration: Add Available From for Rent/Lease (immediate or date)
-- Run this SQL in your database to add the column

ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_from TEXT;
