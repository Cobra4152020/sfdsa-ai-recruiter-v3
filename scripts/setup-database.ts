#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js"
import { createPerformanceMetricsTable } from "@/lib/database-setup"
import type { Database } from "@/types/supabase"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

async function setupDatabase() {
  try {
    console.log("Starting database setup...")
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    // Create performance metrics table
    await createPerformanceMetricsTable()
    console.log("✓ Performance metrics table created/verified")

    // Add timestamps to tables that need them
    const tablesToUpdate = [
      'chat_interactions',
      'tiktok_challenges',
      'trivia_games',
      'daily_briefings'
    ]

    for (const table of tablesToUpdate) {
      await supabase.rpc('add_timestamps_to_table', { table_name: table })
      console.log(`✓ Added timestamps to ${table}`)
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error during database setup:", error)
    process.exit(1)
  }
}

setupDatabase() 