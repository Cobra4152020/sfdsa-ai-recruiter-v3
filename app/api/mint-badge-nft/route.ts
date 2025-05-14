import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { badgeId, userBadgeId } = body

    // Validate the session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the badge belongs to the user
    const { data: badgeData, error: badgeError } = await supabase
      .from("user_badges")
      .select("*")
      .eq("id", userBadgeId)
      .eq("user_id", session.user.id)
      .single()

    if (badgeError || !badgeData) {
      return NextResponse.json({ error: "Badge not found or not owned by user" }, { status: 404 })
    }

    // Check if the badge is already minted
    if (badgeData.nft_minted) {
      return NextResponse.json({ error: "Badge already minted as NFT" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Call your NFT minting service/API
    // 2. Wait for the transaction to complete
    // 3. Store the transaction hash

    // For now, we'll simulate a successful minting
    const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    // Update the badge record
    const { error: updateError } = await supabase
      .from("user_badges")
      .update({
        nft_minted: true,
        nft_transaction_hash: mockTxHash,
      })
      .eq("id", userBadgeId)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update badge" }, { status: 500 })
    }

    // Create a notification for the user
    await supabase.from("user_notifications").insert({
      user_id: session.user.id,
      title: "Badge NFT Minted!",
      message: `Your badge has been successfully minted as an NFT. Transaction: ${mockTxHash.substring(0, 10)}...`,
      type: "achievement",
      action_url: `/profile/badges`,
    })

    return NextResponse.json({
      success: true,
      transaction_hash: mockTxHash,
    })
  } catch (error) {
    console.error("Error in NFT minting API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
