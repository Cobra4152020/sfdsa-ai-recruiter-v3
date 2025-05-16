export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const supabase = createClient()

    // Get donation amounts and counts
    const { data: donationData, error: donationError } = await supabase
      .from("donations")
      .select("id, amount")
      .eq("status", "completed")
      .gte("created_at", startDate)
      .lte("created_at", endDate)

    if (donationError) {
      console.error("Error fetching donation data:", donationError)
      return NextResponse.json({ error: donationError.message }, { status: 500 })
    }

    // Get donation points
    const { data: pointsData, error: pointsError } = await supabase
      .from("donation_points")
      .select("donation_id, points")
      .gte("created_at", startDate)
      .lte("created_at", endDate)

    if (pointsError) {
      console.error("Error fetching donation points data:", pointsError)
      return NextResponse.json({ error: pointsError.message }, { status: 500 })
    }

    // Calculate statistics
    const totalAmount = donationData.reduce((sum, donation) => sum + Number.parseFloat(donation.amount), 0)
    const totalCount = donationData.length
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0
    const totalPoints = pointsData.reduce((sum, point) => sum + point.points, 0)
    const pointsPerDollar = totalAmount > 0 ? totalPoints / totalAmount : 0

    return NextResponse.json({
      totalAmount,
      totalCount,
      averageAmount,
      totalPoints,
      pointsPerDollar,
    })
  } catch (error) {
    console.error("Exception in donation stats endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
