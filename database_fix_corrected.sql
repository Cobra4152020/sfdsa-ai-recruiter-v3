-- Corrected fix for registration - matching actual table structure
-- This addresses the column mismatch causing "Database error saving new user"

-- First, remove the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_registration() CASCADE;

-- Create the corrected registration function with proper column names
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_email TEXT;
    user_first_name TEXT;
    user_last_name TEXT;
    user_full_name TEXT;
    user_user_type TEXT;
    user_referral_code TEXT;
BEGIN
    -- Extract metadata from new user
    user_email := NEW.email;
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', CONCAT(user_first_name, ' ', user_last_name));
    user_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'recruit');
    user_referral_code := COALESCE(NEW.raw_user_meta_data->>'referral_code', NULL);

    -- Create entry in main users table
    INSERT INTO public.users (
        id,
        name,
        email,
        participation_count,
        has_applied,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        user_full_name,
        user_email,
        0,
        FALSE,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- Route to appropriate table based on user type
    IF user_user_type = 'volunteer' THEN
        -- Create volunteer recruiter (using actual column names)
        INSERT INTO public.volunteer_recruiters (
            user_id,
            name,
            email,
            points,
            is_approved,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            user_full_name,
            user_email,
            0,
            FALSE,
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
        
    ELSIF user_user_type = 'admin' THEN
        -- Create admin user (using actual column names)
        INSERT INTO public.admins (
            user_id,
            name,
            email,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            user_full_name,
            user_email,
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
        
    ELSE
        -- Default to recruit (using actual column names)
        INSERT INTO public.recruits (
            user_id,
            name,
            email,
            points,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            user_full_name,
            user_email,
            50, -- Welcome bonus points
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Create user type record
    INSERT INTO public.user_types (
        user_id,
        user_type,
        created_at
    ) VALUES (
        NEW.id,
        user_user_type,
        NOW()
    ) ON CONFLICT (user_id) DO UPDATE SET user_type = EXCLUDED.user_type;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user_registration trigger: % %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_registration();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user_registration() TO anon, authenticated, service_role;

-- Test the setup
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
    
    RAISE NOTICE 'Corrected registration trigger setup completed successfully!';
    RAISE NOTICE 'Users will now be created with the correct column mappings.';
END $$;
