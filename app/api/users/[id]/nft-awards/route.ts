
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"
import { NFT_AWARD_TIERS } from "@/lib/nft-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Get user's NFT awards
    const { data, error } = await serviceClient
      .from("user_nft_awards")
      .select("*")
      .eq("user_id", userId)
      .order("awarded_at", { ascending: false })

    if (error) {
      console.error("Error fetching user NFT awards:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch NFT awards" }, { status: 500 })
    }

    // Format the awards
    const awards = data.map((item) => {
      const awardDetails = NFT_AWARD_TIERS.find((award) => award.id === item.nft_award_id)

      return {
        id: item.nft_award_id,
        name: awardDetails?.name || "Unknown Award",
        description: awardDetails?.description || "",
        imageUrl: awardDetails?.imageUrl || "",
        pointThreshold: awardDetails?.pointThreshold || 0,
        tokenId: item.token_id,
        contractAddress: item.contract_address,
        awardedAt: item.awarded_at,
        pointsAtAward: item.points_at_award,
        blockchainExplorerUrl: item.contract_address
          ? `https://etherscan.io/token/${item.contract_address}?a=${item.token_id}`
          : undefined,
      }
    })

    // Get user's current points
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("participation_count")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      // Continue without user points
    }

    // Get next available award
    const currentPoints = user?.participation_count || 0
    const earnedThresholds = data.map((item) => {
      const award = NFT_AWARD_TIERS.find((a) => a.id === item.nft_award_id)
      return award?.pointThreshold || 0
    })

    const nextAward = NFT_AWARD_TIERS.filter((award) => !earnedThresholds.includes(award.pointThreshold))
      .sort((a, b) => a.pointThreshold - b.pointThreshold)
      .find((award) => award.pointThreshold > currentPoints)

    return NextResponse.json({
      success: true,
      awards,
      currentPoints,
      nextAward: nextAward
        ? {
            ...nextAward,
            pointsNeeded: nextAward.pointThreshold - currentPoints,
          }
        : null,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
