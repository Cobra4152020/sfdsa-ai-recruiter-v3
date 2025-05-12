import { NextResponse } from "next/server"
import { markBriefingAttended } from "@/lib/daily-briefing-service"
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
          message: "You must be logged in to mark a briefing as attended.",
        },
        { status: 401 },
      )
    }

    // Get the briefing ID from the request body
    const { briefingId } = await request.json()

    if (!briefingId) {
      return NextResponse.json(
        {
          error: "Missing briefing ID",
          message: "The briefing ID is required.",
        },
        { status: 400 },
      )
    }

    // Mark the briefing as attended
    const result = await markBriefingAttended(user.id, briefingId)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to mark briefing as attended",
          message: result.error || "An unexpected error occurred.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error marking briefing as attended:", error)
    return NextResponse.json(
      {
        error: "Failed to mark briefing as attended",
        message: "An unexpected error occurred.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
