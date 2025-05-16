
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    const supabase = createClient()

    // Get total donations
    const { data: totalData, error: totalError } = await supabase
      .from("donations")
      .select("amount")
      .eq("status", "completed")

    if (totalError) throw totalError

    const totalAmount = totalData.reduce((sum, donation) => sum + Number.parseFloat(donation.amount), 0)
    const totalCount = totalData.length

    // Get donations by period
    let timeConstraint
    const now = new Date()

    switch (period) {
      case "week":
        const lastWeek = new Date(now)
        lastWeek.setDate(lastWeek.getDate() - 7)
        timeConstraint = lastWeek.toISOString()
        break
      case "month":
        const lastMonth = new Date(now)
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        timeConstraint = lastMonth.toISOString()
        break
      case "year":
        const lastYear = new Date(now)
        lastYear.setFullYear(lastYear.getFullYear() - 1)
        timeConstraint = lastYear.toISOString()
        break
      default:
        timeConstraint = new Date(0).toISOString() // All time
    }

    const { data: periodData, error: periodError } = await supabase
      .from("donations")
      .select("amount, created_at")
      .eq("status", "completed")
      .gte("created_at", timeConstraint)
      .order("created_at", { ascending: true })

    if (periodError) throw periodError

    // Get recurring donations count
    const { count: recurringCount, error: recurringError } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact" })
      .eq("status", "active")

    if (recurringError) throw recurringError

    // Format data for charts
    const chartData = formatChartData(periodData, period)

    return NextResponse.json({
      totalAmount,
      totalCount,
      periodAmount: periodData.reduce((sum, donation) => sum + Number.parseFloat(donation.amount), 0),
      periodCount: periodData.length,
      recurringCount,
      chartData,
    })
  } catch (error) {
    console.error("Error fetching donation analytics:", error)
    return NextResponse.json({ error: "Error fetching donation analytics" }, { status: 500 })
  }
}

function formatChartData(donations: any[], period: string) {
  if (donations.length === 0) return []

  const groupedData: Record<string, number> = {}

  donations.forEach((donation) => {
    const date = new Date(donation.created_at)
    let key

    switch (period) {
      case "week":
        key = date.toLocaleDateString("en-US", { weekday: "short" })
        break
      case "month":
        key = date.toLocaleDateString("en-US", { day: "numeric" })
        break
      case "year":
        key = date.toLocaleDateString("en-US", { month: "short" })
        break
      default:
        key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }

    if (!groupedData[key]) {
      groupedData[key] = 0
    }

    groupedData[key] += Number.parseFloat(donation.amount)
  })

  return Object.entries(groupedData).map(([label, value]) => ({
    label,
    value,
  }))
}
