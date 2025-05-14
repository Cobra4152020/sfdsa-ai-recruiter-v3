-- Add missing columns to user_roles table
ALTER TABLE IF EXISTS user_roles 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add index for faster queries on is_active
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON user_roles(is_active);

-- Update existing records to have values for the new columns
UPDATE user_roles 
SET assigned_at = created_at, 
    is_active = TRUE 
WHERE assigned_at IS NULL;
