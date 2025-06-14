import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const { action, details } = await request.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("engagement_analytics").insert({
      user_id: user?.id,
      action: action,
      details: details,
    });

    if (error) {
      console.error("Error logging engagement:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in engagement tracking:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
} 