-- Function to safely drop and recreate policies
CREATE OR REPLACE FUNCTION safely_recreate_policy(
    p_table_name text,
    p_policy_name text,
    p_command text
) RETURNS void AS $recreate_policy$
BEGIN
    -- Drop existing policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', p_policy_name, p_table_name);
    -- Create new policy
    EXECUTE p_command;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error recreating policy % on table %: %', p_policy_name, p_table_name, SQLERRM;
END;
$recreate_policy$ LANGUAGE plpgsql;

-- Function to safely enable RLS
CREATE OR REPLACE FUNCTION safely_enable_rls(
    p_table_name text
) RETURNS void AS $enable_rls$
BEGIN
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', p_table_name);
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error enabling RLS on table %: %', p_table_name, SQLERRM;
END;
$enable_rls$ LANGUAGE plpgsql;

-- Function to clean up policies
CREATE OR REPLACE FUNCTION cleanup_policies() RETURNS void AS $cleanup_policies$
DECLARE
    r RECORD;
BEGIN
    -- Get all tables in public schema
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        -- Enable RLS
        PERFORM safely_enable_rls(r.tablename);
        
        -- Recreate basic policies
        PERFORM safely_recreate_policy(
            r.tablename,
            'Users can view own data',
            format(
                'CREATE POLICY "Users can view own data" ON %I FOR SELECT USING (
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM information_schema.columns 
                            WHERE table_schema = ''public'' 
                            AND table_name = %L 
                            AND column_name = ''user_id''
                        ) THEN auth.uid() = user_id
                        ELSE true
                    END
                )', 
                r.tablename, 
                r.tablename
            )
        );
        
        -- Admin policy
        PERFORM safely_recreate_policy(
            r.tablename,
            'Admins can do everything',
            format(
                'CREATE POLICY "Admins can do everything" ON %I FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM user_roles 
                        WHERE user_id = auth.uid() 
                        AND role = ''admin''
                    )
                )',
                r.tablename
            )
        );
    END LOOP;
END;
$cleanup_policies$ LANGUAGE plpgsql;

-- Execute cleanup
SELECT cleanup_policies();

-- Drop helper functions
DROP FUNCTION IF EXISTS cleanup_policies();
DROP FUNCTION IF EXISTS safely_recreate_policy(text, text, text);
DROP FUNCTION IF EXISTS safely_enable_rls(text); 