-- Migration to add area_unit and flooring columns to properties table
-- Run this SQL in your database to add the columns

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS area_unit TEXT;

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS flooring TEXT;
