import { getServiceSupabase } from "@/lib/supabase-clients"

/**
 * Runs the database setup scripts to ensure all required tables and columns exist
 */
export async function setupDatabase() {
  try {
    const supabase = getServiceSupabase()

    console.log("Starting database setup...")

    // Check if avatar_url column exists in users table
    const { data: columnCheck, error: columnCheckError } = await supabase.rpc("check_column_exists", {
      table_name: "users",
      column_name: "avatar_url",
    })

    if (columnCheckError) {
      console.error("Error checking for avatar_url column:", columnCheckError)

      // Create RPC function to check if column exists if it doesn't already exist
      await supabase
        .rpc(
          "create_check_column_exists_function",
          {},
          {
            count: "exact",
            head: true,
          },
        )
        .catch(() => {
          // Function might already exist, continue
        })

      // Add avatar_url column if it doesn't exist
      await supabase.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
        
        -- Add default avatars to existing users
        UPDATE users 
        SET avatar_url = '/placeholder.svg?key=wfajv' || id::text
        WHERE avatar_url IS NULL;
        
        -- Create index on participation_count for faster leaderboard queries
        CREATE INDEX IF NOT EXISTS users_participation_count_idx ON users(participation_count DESC);
      `)

      console.log("Added avatar_url column to users table")
    } else if (!columnCheck) {
      console.log("Adding avatar_url column to users table...")

      // Add avatar_url column
      await supabase.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
        
        -- Add default avatars to existing users
        UPDATE users 
        SET avatar_url = '/placeholder.svg?key=umh2z' || id::text
        WHERE avatar_url IS NULL;
        
        -- Create index on participation_count for faster leaderboard queries
        CREATE INDEX IF NOT EXISTS users_participation_count_idx ON users(participation_count DESC);
      `)

      console.log("Added avatar_url column to users table")
    } else {
      console.log("avatar_url column already exists in users table")
    }

    console.log("Database setup completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Error setting up database:", error)
    return { success: false, error }
  }
}

/**
 * Creates the RPC function to check if a column exists in a table
 */
export async function createColumnCheckFunction() {
  try {
    const supabase = getServiceSupabase()

    await supabase.query(`
      CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
      RETURNS boolean
      LANGUAGE plpgsql
      AS $$
      DECLARE
        column_exists boolean;
      BEGIN
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = $1
          AND column_name = $2
        ) INTO column_exists;
        
        RETURN column_exists;
      END;
      $$;
    `)

    return { success: true }
  } catch (error) {
    console.error("Error creating column check function:", error)
    return { success: false, error }
  }
}
