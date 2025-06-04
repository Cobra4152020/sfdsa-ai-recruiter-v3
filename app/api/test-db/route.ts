import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const debugInfo: unknown = {
      timestamp: new Date().toISOString(),
      steps: [],
      errors: [],
    };

    // Test 1: Check if we can connect to Supabase
    debugInfo.steps.push("Testing Supabase connection");
    const { error: connectionError } = await supabase
      .from("user_roles")
      .select("count(*)", { count: "exact", head: true });

    if (connectionError) {
      debugInfo.errors.push({
        type: "connection_error",
        message: connectionError.message,
        code: connectionError.code,
        details: connectionError.details,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          debug: debugInfo,
        },
        { status: 500 },
      );
    }

    debugInfo.steps.push("Connection successful");

    // Test 2: Check user_roles table structure
    debugInfo.steps.push("Checking user_roles table structure");
    const { data: tableInfo, error: tableError } = await supabase
      .from("user_roles")
      .select("*")
      .limit(1);

    if (tableError) {
      debugInfo.errors.push({
        type: "table_error",
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Failed to access user_roles table",
          debug: debugInfo,
        },
        { status: 500 },
      );
    }

    debugInfo.tableStructure =
      tableInfo.length > 0 ? Object.keys(tableInfo[0]) : [];
    debugInfo.steps.push("Table structure verified");

    // Test 3: Check RLS policies
    debugInfo.steps.push("Checking RLS policies");
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("*")
      .eq("tablename", "user_roles");

    if (policiesError) {
      debugInfo.errors.push({
        type: "policies_error",
        message: policiesError.message,
        code: policiesError.code,
        details: policiesError.details,
      });
    } else {
      debugInfo.policies = policies;
    }

    debugInfo.steps.push("Database check completed");
    return NextResponse.json({
      success: true,
      message: "Database access verified",
      debug: debugInfo,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error during database test",
        debug: {
          timestamp: new Date().toISOString(),
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  stack: error.stack,
                }
              : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
