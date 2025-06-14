-- Simple fix to prevent "Database error saving new user"
-- This creates a minimal trigger that won't fail

-- First, remove any existing problematic triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a very simple trigger function that doesn't do complex operations
CREATE OR REPLACE FUNCTION public.handle_new_user_simple()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
    -- Log the new user creation (this won't fail)
    RAISE LOG 'New user created: %', NEW.id;
    
    -- Just return NEW without doing anything that could fail
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Even if something goes wrong, don't block auth user creation
    RAISE LOG 'Error in handle_new_user_simple: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the minimal trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_simple();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user_simple() TO anon, authenticated, service_role;

-- Test that the trigger was created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
        AND event_object_table = 'users'
        AND event_object_schema = 'auth'
    ) THEN
        RAISE NOTICE 'Simple trigger created successfully!';
    ELSE
        RAISE EXCEPTION 'Simple trigger creation failed!';
    END IF;
END $$;
