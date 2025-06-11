export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { recordShare } from "@/lib/daily-briefing-service";
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

    // Get briefing ID and platform from request body
    const { briefingId, platform } = await request.json();

    if (!briefingId || !platform) {
      return NextResponse.json(
        { error: "Briefing ID and platform are required" },
        { status: 400 },
      );
    }

    // Record share
    const success = await recordShare(user.id, briefingId, platform);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to record share or already shared on this platform" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in share API:", error);
    return NextResponse.json(
      { error: "Failed to record share" },
      { status: 500 },
    );
  }
}
