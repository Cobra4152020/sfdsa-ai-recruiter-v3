export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const supabase = getServiceSupabase()

    const { data, error } = await supabase.rpc("get_campaign_performance", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (error) {
      console.error("Error fetching campaign performance:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      campaigns: (data as Array<{
        campaign_id: string;
        campaign_name: string;
        total_donations: string;
        total_amount: string;
        total_points: string;
        points_per_dollar: string;
        avg_donation: string;
      }>).map((item) => ({
        campaignId: item.campaign_id,
        campaignName: item.campaign_name,
        totalDonations: Number.parseInt(item.total_donations),
        totalAmount: Number.parseFloat(item.total_amount),
        totalPoints: Number.parseInt(item.total_points),
        pointsPerDollar: Number.parseFloat(item.points_per_dollar),
        avgDonation: Number.parseFloat(item.avg_donation),
      })),
    })
  } catch (error) {
    console.error("Exception in campaign performance endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
