export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const supabase = getServiceSupabase()

    const { data, error } = await supabase.rpc("get_donation_conversion_rates", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (error) {
      console.error("Error fetching donation conversion rates:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      conversionRates: data.map((item) => ({
        referralSource: item.referral_source,
        pageViews: Number.parseInt(item.page_views),
        formStarts: Number.parseInt(item.form_starts),
        completions: Number.parseInt(item.completions),
        conversionRate: Number.parseFloat(item.conversion_rate),
        avgAmount: Number.parseFloat(item.avg_amount),
      })),
    })
  } catch (error) {
    console.error("Exception in donation conversion rates endpoint:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
