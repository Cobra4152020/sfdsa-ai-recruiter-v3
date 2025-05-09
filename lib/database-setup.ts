import { getServiceSupabase } from "./supabase-service"
import { withRetry } from "./supabase-service"
import fs from "fs"
import { setupApplicantsTable } from "./database-setup-applicants"

/**
 * Creates a function to check if columns exist in a table
 */
export async function createColumnCheckFunction() {
  try {
    const supabase = getServiceSupabase()

    // Check if the function already exists
    const { data: functionExists, error: functionCheckError } = await supabase.rpc("function_exists", {
      function_name: "check_columns",
    })

    if (functionCheckError || !functionExists) {
      console.log("Creating check_columns function...")

      // Create the function
      const { error: createFunctionError } = await supabase.rpc("create_function", {
        function_definition: `
          CREATE OR REPLACE FUNCTION check_columns(table_name TEXT, column_names TEXT[])
          RETURNS BOOLEAN AS $$
          DECLARE
            column_record RECORD;
          BEGIN
            FOR column_record IN SELECT column_name FROM information_schema.columns WHERE table_name = table_name LOOP
              IF NOT column_names @> ARRAY[column_record.column_name] THEN
                RETURN FALSE;
              END IF;
            END LOOP;
            RETURN TRUE;
          END;
          $$ LANGUAGE plpgsql;
        `,
      })

      if (createFunctionError) {
        console.error("Error creating check_columns function:", createFunctionError)
      }
    }
  } catch (error) {
    console.error("Error creating column check function:", error)
  }
}

/**
 * Sets up the database schema, including migrations and sample data population
 */
export async function setupDatabase() {
  try {
    const migrations = [
      "create_awards_system_schema.sql",
      "update_users_add_avatar_url.sql",
      "create_leaderboard_tables.sql",
      "create_leaderboard_views.sql",
      "fix_leaderboard_refresh.sql",
      "create_nft_awards_tables.sql",
      "populate_sample_data.sql",
      "create_trivia_schema.sql",
      "create_chat_interactions_table.sql",
      "create_utility_functions.sql",
      "create_user_function.sql",
      "update_badges_schema.sql",
      "create_performance_metrics_function.sql", // Ensure this migration runs
    ]

    const supabase = getServiceSupabase()

    // Run migrations
    for (const migration of migrations) {
      await withRetry(async () => {
        const { error } = await supabase.rpc("exec_sql", {
          sql_query: fs.readFileSync(`./migrations/${migration}`, "utf8"),
        })
        if (error) {
          throw new Error(`Migration failed: ${migration} - ${error.message}`)
        }
      })
    }

    // Setup applicants table
    await setupApplicantsTable()

    console.log("Database setup complete")
    return { success: true }
  } catch (error) {
    console.error("Error setting up database:", error)
    return { success: false, error }
  }
}

/**
 * Creates the performance_metrics table if it doesn't exist
 */
export async function createPerformanceMetricsTable() {
  try {
    const supabase = getServiceSupabase()

    // First, try to create the function if it doesn't exist
    try {
      const functionSql = fs.readFileSync("./migrations/create_performance_metrics_function.sql", "utf8")
      await supabase.rpc("exec_sql", { sql_query: functionSql })
    } catch (functionError) {
      console.log("Note: Could not create function via RPC, will try direct table creation")
    }

    // Try to call the function if it exists
    try {
      await withRetry(async () => {
        const { error } = await supabase.rpc("create_performance_metrics_table")
        if (error) {
          throw new Error(`Failed to create performance_metrics table via function: ${error.message}`)
        }
      })
      return true
    } catch (rpcError) {
      console.log("Function call failed, falling back to direct SQL:", rpcError)

      // If the function doesn't exist or fails, create the table directly
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.performance_metrics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          metric_name TEXT NOT NULL,
          metric_value DOUBLE PRECISION NOT NULL,
          rating TEXT NOT NULL,
          path TEXT,
          user_agent TEXT,
          navigation_type TEXT,
          metric_id TEXT,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Create indexes if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_performance_metrics_timestamp') THEN
            CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_performance_metrics_name') THEN
            CREATE INDEX idx_performance_metrics_name ON public.performance_metrics(metric_name);
          END IF;
        END
        $$;
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: createTableSQL })
      if (error) {
        throw new Error(`Failed to create performance_metrics table directly: ${error.message}`)
      }
      return true
    }
  } catch (error) {
    console.error("Error creating performance_metrics table:", error)
    return false
  }
}
