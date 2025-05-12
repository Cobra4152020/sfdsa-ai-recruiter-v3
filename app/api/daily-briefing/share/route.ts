import { NextResponse } from "next/server"
import { recordBriefingShare } from "@/lib/daily-briefing-service"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to record a briefing share.",
        },
        { status: 401 },
      )
    }

    // Get the briefing ID and platform from the request body
    const { briefingId, platform } = await request.json()

    if (!briefingId || !platform) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "The briefing ID and platform are required.",
        },
        { status: 400 },
      )
    }

    // Record the briefing share
    const result = await recordBriefingShare(user.id, briefingId, platform)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to record briefing share",
          message: result.error || "An unexpected error occurred.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error recording briefing share:", error)
    return NextResponse.json(
      {
        error: "Failed to record briefing share",
        message: "An unexpected error occurred.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
