import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function updateUserRolesSchema() {
  try {
    const supabase = getServiceSupabase();

    // Get the SQL from the migration file
    const migrationSql = `
    -- Add missing columns to user_roles table
    ALTER TABLE IF EXISTS user_roles 
    ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    
    -- Add index for faster queries on is_active
    CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON user_roles(is_active);
    
    -- Update existing records to have values for the new columns
    UPDATE user_roles 
    SET assigned_at = created_at, 
        is_active = TRUE 
    WHERE assigned_at IS NULL;
    `;

    // Execute the SQL migration
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: migrationSql,
    });

    if (error) {
      console.error("Error updating user_roles schema:", error);
      return { success: false, error: error.message };
    }

    // Revalidate paths that might be affected

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating user_roles schema:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await updateUserRolesSchema(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in updateUserRolesSchema:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
