export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import { getBriefingStats } from "@/lib/daily-briefing-service";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // Get the user ID from the session
    const supabase = getServiceSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Get briefing ID from query params
    const url = new URL(request.url);
    const briefingId = url.searchParams.get("briefingId");

    if (!briefingId) {
      return NextResponse.json(
        { error: "Briefing ID is required" },
        { status: 400 },
      );
    }

    // Get stats
    const stats = await getBriefingStats(briefingId, userId || undefined);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error in stats API:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
