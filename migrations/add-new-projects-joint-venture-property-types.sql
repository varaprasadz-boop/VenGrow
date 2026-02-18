-- Add New Projects and Joint Venture to property_type enum for Add Property dropdown
ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'new_projects';
ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'joint_venture';
