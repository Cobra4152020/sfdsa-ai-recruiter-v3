import { NextResponse } from "next/server"
import { redeemReward } from "@/lib/recruiter-rewards-service"

export async function POST(request: Request) {
  try {
    const { recruiterId, rewardId, notes } = await request.json()

    if (!recruiterId || !rewardId) {
      return NextResponse.json({ success: false, message: "Recruiter ID and reward ID are required" }, { status: 400 })
    }

    const result = await redeemReward({
      recruiterId,
      rewardId,
      notes,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in reward redemption POST:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
