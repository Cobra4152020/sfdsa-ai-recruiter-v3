import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export const dynamic = 'force-dynamic';

// Update the GET handler to use the correct column names
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Get user data
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("participation_count, has_applied")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json({ success: false, message: "Failed to fetch user data" }, { status: 500 })
    }

    // Count badges
    const { count: badgeCount, error: countError } = await serviceClient
      .from("badges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)

    if (countError) {
      console.error("Error counting badges:", countError)
      return NextResponse.json({ success: false, message: "Failed to count badges" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      stats: {
        participationCount: user?.participation_count || 0,
        hasApplied: user?.has_applied || false,
        badgeCount: badgeCount || 0,
      },
    })
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
