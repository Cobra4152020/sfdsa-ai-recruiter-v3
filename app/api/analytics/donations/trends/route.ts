
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()
    const interval = searchParams.get("interval") || "day"

    const supabase = createClient()

    const { data, error } = await supabase.rpc("get_donation_trends", {
      p_start_date: startDate,
      p_end_date: endDate,
      p_interval: interval,
    })

    if (error) {
      console.error("Error fetching donation trends:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      trends: data.map((item) => ({
        period: item.period,
        totalAmount: Number.parseFloat(item.total_amount),
        donationCount: Number.parseInt(item.donation_count),
        recurringAmount: Number.parseFloat(item.recurring_amount),
        onetimeAmount: Number.parseFloat(item.onetime_amount),
        avgPointsPerDollar: Number.parseFloat(item.avg_points_per_dollar),
      })),
    })
  } catch (error) {
    console.error("Exception in donation trends endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
