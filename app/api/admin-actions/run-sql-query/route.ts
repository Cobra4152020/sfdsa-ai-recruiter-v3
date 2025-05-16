import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export async function runSqlQuery(query: string, revalidatePaths: string[] = []) {
  try {
    const supabase = getServiceSupabase()

    // Execute the SQL query using the exec_sql RPC function
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })

    if (error) {
      console.error("Error executing SQL query:", error)
      return {
        success: false,
        error: error.message,
        query,
      }
    }

    // Revalidate any paths that might be affected by this query
    
    return {
      success: true,
      data,
      query,
    }
  } catch (error) {
    console.error("Unexpected error executing SQL query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      query,
    }
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await runSqlQuery(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in runSqlQuery:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}