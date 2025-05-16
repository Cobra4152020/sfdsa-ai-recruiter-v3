#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
console.log("Looking for .env.local at:", envPath)
console.log("File exists:", fs.existsSync(envPath))

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  console.log("Environment file content available:", !!envContent)
  dotenv.config({ path: envPath })
}

async function fixTableChecks() {
  try {
    console.log("Starting table check fixes...")
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Environment variables loaded:", {
        url: !!supabaseUrl,
        key: !!supabaseKey
      })
      throw new Error("Missing Supabase environment variables")
    }

    console.log("Connecting to Supabase...")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create improved table check function
    console.log("Creating improved table check function...")
    await supabase.rpc("exec_sql", {
      sql_query: `
        -- Drop existing functions if they exist
        DROP FUNCTION IF EXISTS public.check_table_exists;
        DROP FUNCTION IF EXISTS public.check_required_tables;

        -- Create improved table check function
        CREATE OR REPLACE FUNCTION public.check_table_exists(p_schema_name text, p_table_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN EXISTS (
            SELECT 1
            FROM information_schema.tables t
            WHERE t.table_schema = p_schema_name
            AND t.table_name = p_table_name
          );
        END;
        $$;

        -- Create helper function to check all required tables
        CREATE OR REPLACE FUNCTION public.check_required_tables()
        RETURNS TABLE (
          table_name text,
          exists boolean
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            required.table_name::text,
            public.check_table_exists('public', required.table_name) as exists
          FROM (
            VALUES 
              ('users'),
              ('user_roles'),
              ('user_types'),
              ('badges'),
              ('user_badges'),
              ('applicants'),
              ('leaderboard'),
              ('recruiter_rewards'),
              ('recruiter_leaderboard'),
              ('tiktok_challenges'),
              ('tiktok_challenge_submissions'),
              ('trivia_games'),
              ('trivia_badges')
          ) as required(table_name);
        END;
        $$;
      `
    })

    console.log("Table check fixes completed successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error during table check fixes:", error)
    return { success: false, error: String(error) }
  }
}

fixTableChecks() 