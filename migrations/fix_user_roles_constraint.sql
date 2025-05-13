-- Fix the role column constraint directly
BEGIN;

-- Drop the constraint if it exists (ignoring errors)
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_type_check;

-- Add the correct constraint
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('recruit', 'volunteer', 'admin'));

-- Make sure we have at least one admin
INSERT INTO user_roles (user_id, role, assigned_at, is_active)
SELECT id, 'admin', NOW(), TRUE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles WHERE role = 'admin')
LIMIT 1;

-- Sync user_types table with user_roles (without email column)
INSERT INTO user_types (user_id, user_type)
SELECT ur.user_id, ur.role
FROM user_roles ur
LEFT JOIN user_types ut ON ur.user_id = ut.user_id
WHERE ut.user_id IS NULL;

COMMIT;
