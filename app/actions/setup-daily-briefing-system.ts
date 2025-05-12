"use server"

import { createClient } from "@/lib/supabase-clients"

export async function setupDailyBriefingSystem() {
  try {
    const supabase = createClient()

    // Check if briefing tables already exist
    const { data: existingTables, error: checkError } = await supabase.from("daily_briefings").select("count").limit(1)

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    // If tables already exist, return success
    if (!checkError && existingTables !== null) {
      return {
        success: true,
        message: "Daily briefing system is already set up.",
        alreadyExists: true,
      }
    }

    // Read and execute the SQL migration
    const migrationSql = `
      -- Create daily_briefings table
      CREATE TABLE IF NOT EXISTS daily_briefings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL UNIQUE,
        theme VARCHAR(50) NOT NULL, -- duty, courage, respect, service, leadership, resilience
        quote TEXT NOT NULL,
        quote_author VARCHAR(255),
        sgt_ken_take TEXT NOT NULL,
        call_to_action TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT TRUE
      );

      -- Create briefing_attendance table to track who viewed the briefing
      CREATE TABLE IF NOT EXISTS briefing_attendance (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
        attended_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        points_awarded INTEGER DEFAULT 0,
        UNIQUE(user_id, briefing_id)
      );

      -- Create briefing_shares table to track social media shares
      CREATE TABLE IF NOT EXISTS briefing_shares (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL, -- twitter, facebook, linkedin, etc.
        shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        points_awarded INTEGER DEFAULT 0
      );

      -- Create table for briefing streaks (consecutive days viewed)
      CREATE TABLE IF NOT EXISTS briefing_streaks (
        user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_briefing_date DATE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_briefing_attendance_user_id ON briefing_attendance(user_id);
      CREATE INDEX IF NOT EXISTS idx_briefing_attendance_briefing_id ON briefing_attendance(briefing_id);
      CREATE INDEX IF NOT EXISTS idx_briefing_shares_user_id ON briefing_shares(user_id);
      CREATE INDEX IF NOT EXISTS idx_briefing_shares_briefing_id ON briefing_shares(briefing_id);
    `

    // Execute the SQL to create the tables
    const { error: sqlError } = await supabase.rpc("exec_sql", { sql: migrationSql })

    if (sqlError) {
      throw sqlError
    }

    // Insert sample data for today
    const today = new Date().toISOString().split("T")[0]

    const { error: insertError } = await supabase.from("daily_briefings").insert([
      {
        date: today,
        theme: "duty",
        quote: "The only easy day was yesterday.",
        quote_author: "Navy SEALs",
        sgt_ken_take:
          "In this job, yesterday's victories don't protect today's streets. Every shift is a new test of your commitment. Show up ready.",
        call_to_action: "Ready to prove yourself daily? Join the Sheriff's Department where every day matters.",
      },
    ])

    if (insertError) {
      throw insertError
    }

    return {
      success: true,
      message: "Daily briefing system set up successfully!",
      alreadyExists: false,
    }
  } catch (error) {
    console.error("Error setting up daily briefing system:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      alreadyExists: false,
    }
  }
}
