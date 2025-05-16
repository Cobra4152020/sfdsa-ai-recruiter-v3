
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const supabase = createClient()

    const { data, error } = await supabase.rpc("get_donation_point_distribution", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (error) {
      console.error("Error fetching donation point distribution:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      distribution: data.map((item) => ({
        pointRange: item.point_range,
        donationCount: Number.parseInt(item.donation_count),
        totalPoints: Number.parseInt(item.total_points),
        avgAmount: Number.parseFloat(item.avg_amount),
      })),
    })
  } catch (error) {
    console.error("Exception in donation point distribution endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
