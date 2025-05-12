-- Enable RLS on tiktok_challenge_submissions table
ALTER TABLE public.tiktok_challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for tiktok_challenge_submissions
-- Allow users to view their own submissions
CREATE POLICY "Users can view their own submissions" 
ON public.tiktok_challenge_submissions
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own submissions
CREATE POLICY "Users can insert their own submissions" 
ON public.tiktok_challenge_submissions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own submissions
CREATE POLICY "Users can update their own submissions" 
ON public.tiktok_challenge_submissions
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow admins to view all submissions
CREATE POLICY "Admins can view all submissions" 
ON public.tiktok_challenge_submissions
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to modify all submissions
CREATE POLICY "Admins can modify all submissions" 
ON public.tiktok_challenge_submissions
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Enable RLS on daily_briefings table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'daily_briefings'
  ) THEN
    EXECUTE 'ALTER TABLE public.daily_briefings ENABLE ROW LEVEL SECURITY';
    
    -- Create policy for public viewing of briefings
    EXECUTE 'CREATE POLICY "Briefings are viewable by everyone" 
    ON public.daily_briefings
    FOR SELECT 
    USING (true)';
    
    -- Create policy for admin management of briefings
    EXECUTE 'CREATE POLICY "Admins can manage briefings" 
    ON public.daily_briefings
    FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = ''admin''
      )
    )';
  END IF;
END
$$;

-- Check for other tables without RLS and enable it
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT IN (
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tableowner = 'rls_enabled'
    )
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_record.tablename);
    
    -- Create default policies for each table
    -- Allow authenticated users to view
    EXECUTE format('CREATE POLICY "Authenticated users can view" ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')', table_record.tablename);
    
    -- Allow users to manage their own data if user_id column exists
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = table_record.tablename 
      AND column_name = 'user_id'
    ) THEN
      EXECUTE format('CREATE POLICY "Users can manage their own data" ON public.%I FOR ALL USING (auth.uid() = user_id)', table_record.tablename);
    END IF;
    
    -- Allow admins to manage all data
    EXECUTE format('CREATE POLICY "Admins can manage all data" ON public.%I FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = ''admin''))', table_record.tablename);
  END LOOP;
END
$$;
