import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import fs from "fs"
import path from "path"

export async function setupLoggingSystem() {
  try {
    const supabase = getServiceSupabase()

    // Check if system_logs table exists
    const { data: tableExists, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "system_logs")
      .eq("table_schema", "public")

    if (checkError) {
      throw new Error(`Error checking if table exists: ${checkError.message}`)
    }

    // If table doesn't exist, create it
    if (!tableExists || tableExists.length === 0) {
      // Read the SQL file
      const sqlPath = path.join(process.cwd(), "migrations", "create_system_logs_table.sql")
      const sql = fs.readFileSync(sqlPath, "utf8")

      // Execute the SQL
      const { error: createError } = await supabase.rpc("exec_sql", { sql })

      if (createError) {
        throw new Error(`Error creating system_logs table: ${createError.message}`)
      }

      return {
        success: true,
        message: "Logging system setup successfully",
        created: true,
      }
    }

    return {
      success: true,
      message: "Logging system already exists",
      created: false,
    }
  } catch (error) {
    console.error("Error setting up logging system:", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      created: false,
    }
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await setupLoggingSystem(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in setupLoggingSystem:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}