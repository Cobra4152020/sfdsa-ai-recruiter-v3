export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { API_CACHE_HEADERS } from "@/lib/cache-utils";

export async function POST() {
  try {
    const supabase = getServiceSupabase();

    // Refresh the leaderboard materialized view
    const { error } = await supabase.rpc("refresh_leaderboard_view");

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to refresh leaderboard view: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 500, headers: API_CACHE_HEADERS },
      );
    }

    // Verify the refresh was successful
    const { error: verifyError } = await supabase
      .from("leaderboard_view")
      .select("count")
      .limit(1);

    if (verifyError) {
      return NextResponse.json(
        {
          success: false,
          message: `Leaderboard view refresh verification failed: ${verifyError.message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 500, headers: API_CACHE_HEADERS },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Leaderboard view refreshed successfully",
        timestamp: new Date().toISOString(),
      },
      { headers: API_CACHE_HEADERS },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error refreshing leaderboard view: ${error}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: API_CACHE_HEADERS },
    );
  }
}
