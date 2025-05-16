
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const supabase = createClient()

    // Get top donors
    const { data: topDonors, error: donorsError } = await supabase
      .from("donation_leaderboard")
      .select("user_id, username, avatar_url, donation_points, total_amount")
      .order("donation_points", { ascending: false })
      .limit(5)

    if (donorsError) {
      console.error("Error fetching top donors:", donorsError)
      return NextResponse.json({ error: donorsError.message }, { status: 500 })
    }

    // Get badges awarded for donations
    const { data: badgeStats, error: badgeError } = await supabase
      .from("user_badges")
      .select("badge_id, count")
      .in("badge_id", [
        "first-donation",
        "recurring-donor",
        "generous-donor",
        "donation-milestone-5",
        "donation-milestone-10",
        "donation-milestone-25",
        "donation-amount-250",
        "donation-amount-500",
        "donation-amount-1000",
      ])
      .gte("awarded_at", startDate)
      .lte("awarded_at", endDate)
      .order("count", { ascending: false })

    if (badgeError) {
      console.error("Error fetching badge stats:", badgeError)
      return NextResponse.json({ error: badgeError.message }, { status: 500 })
    }

    return NextResponse.json({
      topDonors,
      badgeStats,
    })
  } catch (error) {
    console.error("Exception in donation summary endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
