import { NextResponse } from "next/server"
import { getDonationStatistics, getRecentDonations, getActiveSubscriptions } from "@/lib/donation-service"

export async function GET() {
  try {
    // Get donation statistics for all time
    const stats = await getDonationStatistics()

    // Get recent donations
    const recentDonations = await getRecentDonations(5)

    // Get active subscriptions
    const activeSubscriptions = await getActiveSubscriptions()

    return NextResponse.json({
      success: true,
      stats,
      recentDonations,
      activeSubscriptions,
      message: "Donation tables are set up correctly and functioning!",
    })
  } catch (error) {
    console.error("Error testing donation functionality:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "An error occurred while testing donation functionality",
      },
      { status: 500 },
    )
  }
}
