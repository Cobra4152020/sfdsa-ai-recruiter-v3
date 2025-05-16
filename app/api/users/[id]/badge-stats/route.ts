import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { generateUserStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }]
}

// Update the GET handler to use the correct column names
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Get user's badges
    const { data: badges, error } = await supabase
      .from("badges")
      .select("badge_type")
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching user badges:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch badges" }, { status: 500 })
    }

    // Calculate badge stats
    const stats = {
      total: badges.length,
      byType: badges.reduce((acc: Record<string, number>, badge) => {
        acc[badge.badge_type] = (acc[badge.badge_type] || 0) + 1
        return acc
      }, {}),
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

// Update the POST handler to use the correct column names
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const { participationPoints, hasApplied } = await request.json()

    if (participationPoints === undefined && hasApplied === undefined) {
      return NextResponse.json({ success: false, message: "No update parameters provided" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Get current user data
    const { data: user, error: fetchError } = await serviceClient
      .from("users")
      .select("participation_count, has_applied")
      .eq("id", userId)
      .single()

    if (fetchError) {
      console.error("Error fetching user data:", fetchError)
      return NextResponse.json({ success: false, message: "Failed to fetch user data" }, { status: 500 })
    }

    // Prepare update data
    const updateData: { participation_count?: number; has_applied?: boolean } = {}

    if (participationPoints !== undefined) {
      updateData.participation_count = (user?.participation_count || 0) + participationPoints
    }

    if (hasApplied !== undefined) {
      updateData.has_applied = hasApplied
    }

    // Update user
    const { error: updateError } = await serviceClient.from("users").update(updateData).eq("id", userId)

    if (updateError) {
      console.error("Error updating user:", updateError)
      return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      stats: {
        participationCount:
          updateData.participation_count !== undefined
            ? updateData.participation_count
            : user?.participation_count || 0,
        hasApplied: updateData.has_applied !== undefined ? updateData.has_applied : user?.has_applied || false,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
