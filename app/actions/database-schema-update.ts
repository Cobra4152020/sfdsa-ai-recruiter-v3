"use server"

import { getServiceSupabase } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"

export async function updateDatabaseSchema() {
  try {
    const supabase = getServiceSupabase()

    // Read the SQL file
    const migrationSql = `
    -- Create schema for better organization
    CREATE SCHEMA IF NOT EXISTS recruit;
    CREATE SCHEMA IF NOT EXISTS volunteer;

    -- Create separate tables for recruits
    CREATE TABLE IF NOT EXISTS recruit.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatar_url TEXT,
      phone TEXT,
      application_status TEXT DEFAULT 'new',
      points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      has_applied BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create separate tables for volunteer recruiters
    CREATE TABLE IF NOT EXISTS volunteer.recruiters (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      avatar_url TEXT,
      phone TEXT,
      organization TEXT,
      position TEXT,
      location TEXT,
      is_active BOOLEAN DEFAULT FALSE,
      is_verified BOOLEAN DEFAULT FALSE,
      verified_by UUID REFERENCES auth.users(id),
      verified_at TIMESTAMP WITH TIME ZONE,
      referrals_count INTEGER DEFAULT 0,
      successful_referrals INTEGER DEFAULT 0,
      events_participated INTEGER DEFAULT 0,
      events_organized INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create a user type lookup table to quickly determine user type
    CREATE TABLE IF NOT EXISTS public.user_types (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      user_type TEXT NOT NULL CHECK (user_type IN ('recruit', 'volunteer', 'admin')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes for faster lookups
    CREATE INDEX IF NOT EXISTS recruit_users_email_idx ON recruit.users(email);
    CREATE INDEX IF NOT EXISTS volunteer_recruiters_email_idx ON volunteer.recruiters(email);
    CREATE INDEX IF NOT EXISTS user_types_type_idx ON public.user_types(user_type);

    -- Create functions to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create triggers for updated_at columns
    CREATE TRIGGER update_recruit_users_updated_at
    BEFORE UPDATE ON recruit.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_volunteer_recruiters_updated_at
    BEFORE UPDATE ON volunteer.recruiters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- Create function to determine user type
    CREATE OR REPLACE FUNCTION get_user_type(user_id UUID)
    RETURNS TEXT AS $$
    DECLARE
      user_type TEXT;
    BEGIN
      SELECT ut.user_type INTO user_type
      FROM public.user_types ut
      WHERE ut.user_id = get_user_type.user_id;
      
      RETURN user_type;
    END;
    $$ LANGUAGE plpgsql;

    -- Create function to check if user is a recruit
    CREATE OR REPLACE FUNCTION is_recruit(user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM recruit.users WHERE id = is_recruit.user_id
      );
    END;
    $$ LANGUAGE plpgsql;

    -- Create function to check if user is a volunteer recruiter
    CREATE OR REPLACE FUNCTION is_volunteer_recruiter(user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM volunteer.recruiters WHERE id = is_volunteer_recruiter.user_id
      );
    END;
    $$ LANGUAGE plpgsql;

    -- Create migration function to move existing users to the new tables
    CREATE OR REPLACE FUNCTION migrate_existing_users()
    RETURNS VOID AS $$
    DECLARE
      user_record RECORD;
      is_volunteer BOOLEAN;
    BEGIN
      -- Loop through all users in auth.users
      FOR user_record IN SELECT id, email, raw_user_meta_data FROM auth.users
      LOOP
        -- Check if user has volunteer_recruiter role
        SELECT EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = user_record.id AND role = 'volunteer_recruiter'
        ) INTO is_volunteer;
        
        IF is_volunteer THEN
          -- Insert into volunteer.recruiters
          INSERT INTO volunteer.recruiters (
            id, email, first_name, last_name, phone, organization, position, location
          )
          VALUES (
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'last_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'phone', ''),
            COALESCE(user_record.raw_user_meta_data->>'organization', ''),
            COALESCE(user_record.raw_user_meta_data->>'position', ''),
            COALESCE(user_record.raw_user_meta_data->>'location', '')
          )
          ON CONFLICT (id) DO NOTHING;
          
          -- Insert into user_types
          INSERT INTO public.user_types (user_id, user_type)
          VALUES (user_record.id, 'volunteer')
          ON CONFLICT (user_id) DO UPDATE SET user_type = 'volunteer';
        ELSE
          -- Insert into recruit.users
          INSERT INTO recruit.users (
            id, email, name, points, has_applied
          )
          SELECT
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'name', user_record.email),
            COALESCE((SELECT participation_count FROM users WHERE id = user_record.id), 0),
            COALESCE((SELECT has_applied FROM users WHERE id = user_record.id), FALSE)
          ON CONFLICT (id) DO NOTHING;
          
          -- Insert into user_types
          INSERT INTO public.user_types (user_id, user_type)
          VALUES (user_record.id, 'recruit')
          ON CONFLICT (user_id) DO UPDATE SET user_type = 'recruit';
        END IF;
      END LOOP;
    END;
    $$ LANGUAGE plpgsql;

    -- Execute the migration function
    SELECT migrate_existing_users();
    `

    // Execute the SQL migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSql })

    if (error) {
      console.error("Error updating database schema:", error)
      return { success: false, error: error.message }
    }

    // Revalidate paths that might be affected
    revalidatePath("/admin/dashboard")
    revalidatePath("/dashboard")
    revalidatePath("/volunteer-dashboard")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating database schema:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
