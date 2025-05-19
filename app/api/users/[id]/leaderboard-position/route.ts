import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"
import { generateUserStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Get user's position in the leaderboard
    const { data: leaderboard, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("points", { ascending: false })

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch leaderboard position" }, { status: 500 })
    }

    // Find user's position
    const position = leaderboard.findIndex((entry: any) => entry.user_id === userId) + 1
    const totalParticipants = leaderboard.length

    if (position === 0) {
      return NextResponse.json({ success: false, message: "User not found in leaderboard" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      position,
      totalParticipants,
      percentile: Math.round((1 - position / totalParticipants) * 100),
    })
  } catch (error) {
    console.error("Error getting leaderboard position:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
