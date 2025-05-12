import { NextResponse } from "next/server"
import { recordBriefingShare } from "@/lib/daily-briefing-service"

export async function POST(req: Request) {
  try {
    const { userId, briefingId, platform } = await req.json()

    if (!userId || !briefingId || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await recordBriefingShare(userId, briefingId, platform)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to record share" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: result.pointsAwarded,
    })
  } catch (error) {
    console.error("Error in briefing share API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
