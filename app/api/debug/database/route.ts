import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: Check if application_steps table exists and has data
    try {
      const { data: steps, error: stepsError } = await supabase
        .from("application_steps")
        .select("*")
        .limit(5);
      
      results.tests.application_steps = {
        success: !stepsError,
        error: stepsError?.message,
        count: steps?.length || 0,
        sample: steps?.[0] || null
      };
    } catch (err) {
      results.tests.application_steps = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }

    // Test 2: Check if user_point_logs table exists
    try {
      const { data: logs, error: logsError } = await supabase
        .from("user_point_logs")
        .select("*")
        .limit(5);
      
      results.tests.user_point_logs = {
        success: !logsError,
        error: logsError?.message,
        count: logs?.length || 0,
        sample: logs?.[0] || null
      };
    } catch (err) {
      results.tests.user_point_logs = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }

    // Test 3: Check if user_badges table exists
    try {
      const { data: badges, error: badgesError } = await supabase
        .from("user_badges")
        .select("*")
        .limit(5);
      
      results.tests.user_badges = {
        success: !badgesError,
        error: badgesError?.message,
        count: badges?.length || 0,
        sample: badges?.[0] || null
      };
    } catch (err) {
      results.tests.user_badges = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }

    // Test 4: Check if users table exists
    try {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email")
        .limit(3);
      
      results.tests.users = {
        success: !usersError,
        error: usersError?.message,
        count: users?.length || 0
      };
    } catch (err) {
      results.tests.users = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }

    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json(
      { 
        error: "Database debug failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
