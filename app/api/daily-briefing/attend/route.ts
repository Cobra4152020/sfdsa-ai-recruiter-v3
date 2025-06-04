export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { recordAttendance } from "@/lib/daily-briefing-service";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the user from the access token
    const supabase = getServiceSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 },
      );
    }

    // Get briefing ID from request body
    const { briefingId } = await request.json();

    if (!briefingId) {
      return NextResponse.json(
        { error: "Briefing ID is required" },
        { status: 400 },
      );
    }

    // Record attendance
    const success = await recordAttendance(user.id, briefingId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to record attendance" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 },
    );
  }
}
