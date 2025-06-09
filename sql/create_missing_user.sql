-- Create missing user record for the current authenticated user
-- This resolves the "user not found" error when updating profile

INSERT INTO public.users (
    id,
    name,
    email,
    participation_count,
    has_applied,
    created_at,
    updated_at,
    last_active_at
) VALUES (
    '10278ec9-3a35-45bd-b051-eb6f805d0002',
    'Current User',
    'user@example.com',
    0,
    false,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    last_active_at = NOW();

-- Verify the user was created
SELECT id, name, email, participation_count FROM public.users 
WHERE id = '10278ec9-3a35-45bd-b051-eb6f805d0002'; 