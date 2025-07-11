-- Fix user_profiles table

-- Create a view that acts like user_profiles table using existing data
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    u.id,
    u.email,
    SPLIT_PART(u.name, ' ', 1) as first_name,
    CASE 
        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(u.name, ' '), 1) > 1 
        THEN ARRAY_TO_STRING((STRING_TO_ARRAY(u.name, ' '))[2:], ' ')
        ELSE ''
    END as last_name,
    u.name as full_name,
    COALESCE(ut.user_type, 'recruit') as user_type,
    u.avatar_url,
    NULL::text as bio,
    NULL::text as phone,
    COALESCE(u.participation_count, 0) as total_points,
    COALESCE(u.participation_count, 0) as participation_count,
    COALESCE(u.has_applied, false) as has_applied,
    NULL::text as referral_code,
    NULL::text as referred_by,
    u.created_at,
    u.updated_at
FROM public.users u
LEFT JOIN public.user_types ut ON u.id = ut.user_id

UNION ALL

SELECT 
    r.user_id as id,
    r.email,
    SPLIT_PART(r.name, ' ', 1) as first_name,
    CASE 
        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(r.name, ' '), 1) > 1 
        THEN ARRAY_TO_STRING((STRING_TO_ARRAY(r.name, ' '))[2:], ' ')
        ELSE ''
    END as last_name,
    r.name as full_name,
    'recruit' as user_type,
    NULL::text as avatar_url,
    NULL::text as bio,
    NULL::text as phone,
    COALESCE(r.points, 0) as total_points,
    COALESCE(r.points, 0) as participation_count,
    false as has_applied,
    NULL::text as referral_code,
    NULL::text as referred_by,
    r.created_at,
    r.updated_at
FROM public.recruits r
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = r.user_id)

UNION ALL

SELECT 
    vr.user_id as id,
    vr.email,
    vr.name as first_name,
    vr.email as last_name,
    vr.name as full_name,
    'volunteer' as user_type,
    NULL::text as avatar_url,
    NULL::text as bio,
    NULL::text as phone,
    COALESCE(vr.points, 0) as total_points,
    COALESCE(vr.points, 0) as participation_count,
    false as has_applied,
    NULL::text as referral_code,
    NULL::text as referred_by,
    vr.created_at,
    vr.updated_at
FROM public.volunteer_recruiters vr
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = vr.user_id)

UNION ALL

SELECT 
    a.user_id as id,
    a.email,
    a.name as first_name,
    ''::text as last_name,
    a.name as full_name,
    'admin' as user_type,
    NULL::text as avatar_url,
    NULL::text as bio,
    NULL::text as phone,
    0 as total_points,
    0 as participation_count,
    false as has_applied,
    NULL::text as referral_code,
    NULL::text as referred_by,
    a.created_at,
    a.updated_at
FROM public.admins a
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = a.user_id);

-- Grant permissions on the view
GRANT SELECT ON public.user_profiles TO anon, authenticated, service_role;
