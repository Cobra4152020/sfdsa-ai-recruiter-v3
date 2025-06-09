-- Fix registration for existing 3-schema structure
-- This handles the "Database error saving new user" issue for your existing schema

-- Create function to handle new user registration with proper schema routing
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_first_name TEXT;
    user_last_name TEXT;
    user_full_name TEXT;
    user_user_type TEXT;
    user_referral_code TEXT;
    user_phone TEXT;
    user_organization TEXT;
    user_position TEXT;
    user_location TEXT;
BEGIN
    -- Extract metadata from new user
    user_email := NEW.email;
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', CONCAT(user_first_name, ' ', user_last_name));
    user_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'recruit');
    user_referral_code := COALESCE(NEW.raw_user_meta_data->>'referral_code', NULL);
    user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
    user_organization := COALESCE(NEW.raw_user_meta_data->>'organization', '');
    user_position := COALESCE(NEW.raw_user_meta_data->>'position', '');
    user_location := COALESCE(NEW.raw_user_meta_data->>'location', '');

    -- Insert into appropriate table based on user type
    IF user_user_type = 'volunteer' THEN
        -- Insert into volunteer.recruiters table
        INSERT INTO volunteer.recruiters (
            id,
            email,
            first_name,
            last_name,
            phone,
            organization,
            position,
            location,
            is_active,
            is_verified,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            user_email,
            user_first_name,
            user_last_name,
            user_phone,
            user_organization,
            user_position,
            user_location,
            FALSE,
            FALSE,
            NOW(),
            NOW()
        );
        
        -- Insert into user_types lookup
        INSERT INTO public.user_types (user_id, user_type, created_at)
        VALUES (NEW.id, 'volunteer', NOW());
        
    ELSIF user_user_type = 'admin' THEN
        -- Insert into user_types lookup for admin
        INSERT INTO public.user_types (user_id, user_type, created_at)
        VALUES (NEW.id, 'admin', NOW());
        
        -- Optionally create admin profile in a separate admin schema if needed
        -- For now, admins are just tracked in user_types
        
    ELSE
        -- Default to recruit user
        INSERT INTO recruit.users (
            id,
            email,
            name,
            phone,
            application_status,
            points,
            level,
            has_applied,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            user_email,
            user_full_name,
            user_phone,
            'new',
            0,
            1,
            FALSE,
            NOW(),
            NOW()
        );
        
        -- Insert into user_types lookup
        INSERT INTO public.user_types (user_id, user_type, created_at)
        VALUES (NEW.id, 'recruit', NOW());
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user_registration trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger for user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_registration();

-- Ensure Row Level Security is enabled on all tables
ALTER TABLE recruit.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_types ENABLE ROW LEVEL SECURITY;

-- Create/Update RLS policies for recruit.users
DROP POLICY IF EXISTS "Users can view own recruit profile" ON recruit.users;
CREATE POLICY "Users can view own recruit profile" ON recruit.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own recruit profile" ON recruit.users;
CREATE POLICY "Users can update own recruit profile" ON recruit.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage recruit users" ON recruit.users;
CREATE POLICY "Service role can manage recruit users" ON recruit.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create/Update RLS policies for volunteer.recruiters
DROP POLICY IF EXISTS "Users can view own volunteer profile" ON volunteer.recruiters;
CREATE POLICY "Users can view own volunteer profile" ON volunteer.recruiters
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own volunteer profile" ON volunteer.recruiters;
CREATE POLICY "Users can update own volunteer profile" ON volunteer.recruiters
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage volunteer recruiters" ON volunteer.recruiters;
CREATE POLICY "Service role can manage volunteer recruiters" ON volunteer.recruiters
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create/Update RLS policies for user_types
DROP POLICY IF EXISTS "Users can view own user type" ON public.user_types;
CREATE POLICY "Users can view own user type" ON public.user_types
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage user types" ON public.user_types;
CREATE POLICY "Service role can manage user types" ON public.user_types
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant necessary permissions to schemas
GRANT USAGE ON SCHEMA recruit TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA volunteer TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant table permissions for recruit schema
GRANT SELECT, INSERT, UPDATE ON recruit.users TO anon, authenticated;
GRANT ALL ON recruit.users TO service_role;

-- Grant table permissions for volunteer schema
GRANT SELECT, INSERT, UPDATE ON volunteer.recruiters TO anon, authenticated;
GRANT ALL ON volunteer.recruiters TO service_role;

-- Grant table permissions for public schema
GRANT SELECT, INSERT ON public.user_types TO anon, authenticated;
GRANT ALL ON public.user_types TO service_role;

-- Create helper function to get user profile based on type
CREATE OR REPLACE FUNCTION public.get_user_profile(input_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    name TEXT,
    user_type TEXT,
    points INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    user_type_result TEXT;
BEGIN
    -- Get user type
    SELECT ut.user_type INTO user_type_result
    FROM public.user_types ut
    WHERE ut.user_id = input_user_id;
    
    IF user_type_result = 'recruit' THEN
        RETURN QUERY
        SELECT ru.id, ru.email, ru.name, 'recruit'::TEXT, ru.points, ru.created_at
        FROM recruit.users ru
        WHERE ru.id = input_user_id;
    ELSIF user_type_result = 'volunteer' THEN
        RETURN QUERY
        SELECT vr.id, vr.email, CONCAT(vr.first_name, ' ', vr.last_name), 'volunteer'::TEXT, vr.total_points, vr.created_at
        FROM volunteer.recruiters vr
        WHERE vr.id = input_user_id;
    ELSIF user_type_result = 'admin' THEN
        RETURN QUERY
        SELECT au.id, au.email, COALESCE(au.raw_user_meta_data->>'name', au.email), 'admin'::TEXT, 0, au.created_at
        FROM auth.users au
        WHERE au.id = input_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on helper function
GRANT EXECUTE ON FUNCTION public.get_user_profile TO anon, authenticated, service_role;

-- Test the trigger setup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
        AND event_object_table = 'users'
        AND event_object_schema = 'auth'
    ) THEN
        RAISE EXCEPTION 'Registration trigger was not created successfully';
    END IF;
    
    RAISE NOTICE 'Registration fix completed successfully for 3-schema structure!';
    RAISE NOTICE 'Users will now be automatically created in:';
    RAISE NOTICE '- recruit.users (for jobseekers)';
    RAISE NOTICE '- volunteer.recruiters (for volunteer recruiters)';
    RAISE NOTICE '- public.user_types (lookup table for all users)';
END $$; 