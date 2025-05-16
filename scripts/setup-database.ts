#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
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

// Log all environment variables (redacted)
console.log("Environment variables loaded:", {
  NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
})

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

export async function setupDatabase() {
  try {
    console.log("Starting database setup...")
    
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

    // Create tiktok_challenges table
    console.log("Creating tiktok_challenges table...")
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.tiktok_challenges (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          title varchar NOT NULL,
          description text,
          instructions text,
          hashtags text[],
          start_date timestamptz,
          end_date timestamptz,
          points_reward int4,
          badge_reward varchar,
          example_video_url text,
          thumbnail_url text,
          requirements jsonb,
          status varchar,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    })

    // Create tiktok_challenge_submissions table
    console.log("Creating tiktok_challenge_submissions table...")
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.tiktok_challenge_submissions (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          challenge_id uuid REFERENCES public.tiktok_challenges(id),
          user_id uuid REFERENCES auth.users(id),
          video_url text,
          tiktok_url text,
          views_count int4,
          likes_count int4,
          comments_count int4,
          shares_count int4,
          status varchar,
          admin_feedback text,
          verification_code varchar,
          submitted_at timestamptz,
          verified_at timestamptz,
          metadata jsonb
        );

        CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user 
        ON public.tiktok_challenge_submissions(user_id);
        
        CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge 
        ON public.tiktok_challenge_submissions(challenge_id);
      `
    })

    // Create trivia_games table
    console.log("Creating trivia_games table...")
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.trivia_games (
          id varchar PRIMARY KEY,
          name varchar,
          description text,
          image_url text
        );
      `
    })

    // Create trivia_badges table
    console.log("Creating trivia_badges table...")
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.trivia_badges (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id uuid REFERENCES auth.users(id),
          game_id varchar REFERENCES public.trivia_games(id),
          badge_type varchar
        );

        CREATE INDEX IF NOT EXISTS idx_trivia_badges_user 
        ON public.trivia_badges(user_id);
        
        CREATE INDEX IF NOT EXISTS idx_trivia_badges_game 
        ON public.trivia_badges(game_id);
      `
    })

    console.log("Database setup completed successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error during database setup:", error)
    return { success: false, error: String(error) }
  }
}

setupDatabase() 