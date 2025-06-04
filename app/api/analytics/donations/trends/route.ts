export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate =
      searchParams.get("startDate") ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get("endDate") || new Date().toISOString();
    const interval = searchParams.get("interval") || "day";

    const supabase = getServiceSupabase();

    const { data, error } = await supabase.rpc("get_donation_trends", {
      p_start_date: startDate,
      p_end_date: endDate,
      p_interval: interval,
    });

    if (error) {
      console.error("Error fetching donation trends:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      trends: (data as Array<{ date: string; value: number }>).map((item) => ({
        date: item.date,
        value: item.value,
      })),
    });
  } catch (error) {
    console.error("Exception in donation trends endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
