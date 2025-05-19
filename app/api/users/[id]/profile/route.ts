import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"
import { NFT_AWARD_TIERS } from "@/lib/nft-utils"
import type { BadgeType } from "@/lib/badge-utils"
import { generateUserStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

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

    try {
      const serviceClient = getServiceSupabase()

      // Get user profile data - modified to handle missing avatar_url column
      const { data: user, error: userError } = await serviceClient
        .from("users")
        .select(
          `
          id, 
          name, 
          email,
          participation_count, 
          has_applied,
          created_at,
          bio
          `,
        )
        .eq("id", userId)
        .single()

      if (userError) {
        console.error("Error fetching user profile:", userError)
        return NextResponse.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 })
      }

      // Get user's badges
      const { data: badges, error: badgesError } = await serviceClient
        .from("badges")
        .select("id, badge_type, earned_at")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false })

      if (badgesError) {
        console.error("Error fetching user badges:", badgesError)
        // Continue without badges
      }

      // Get user's NFT awards
      const { data: nftAwards, error: nftError } = await serviceClient
        .from("user_nft_awards")
        .select("nft_award_id, awarded_at, token_id, contract_address")
        .eq("user_id", userId)
        .order("awarded_at", { ascending: false })

      if (nftError) {
        console.error("Error fetching user NFT awards:", nftError)
        // Continue without NFT awards
      }

      // Get user's rank in the leaderboard
      const { data: rankData, error: rankError } = await serviceClient
        .from("users")
        .select("id")
        .gte("participation_count", user.participation_count || 0)
        .order("participation_count", { ascending: false })

      if (rankError) {
        console.error("Error fetching user rank:", rankError)
        // Continue without rank
      }

      // Format badges with name and description
      const formattedBadges = (badges || []).map((badge) => ({
        ...badge,
        name: getBadgeName(badge.badge_type as BadgeType),
        description: getBadgeDescription(badge.badge_type as BadgeType),
      }))

      // Format NFT awards with details from NFT_AWARD_TIERS
      const formattedNFTAwards = (nftAwards || []).map((award) => {
        const awardDetails = NFT_AWARD_TIERS.find((tier) => tier.id === award.nft_award_id)
        return {
          ...award,
          name: awardDetails?.name || "Unknown Award",
          description: awardDetails?.description || "",
          imageUrl: awardDetails?.imageUrl || "",
          pointThreshold: awardDetails?.pointThreshold || 0,
        }
      })

      // Calculate next NFT award
      const earnedThresholds = formattedNFTAwards.map((award) => award.pointThreshold)
      const nextAward = NFT_AWARD_TIERS.filter((award) => !earnedThresholds.includes(award.pointThreshold))
        .sort((a, b) => a.pointThreshold - b.pointThreshold)
        .find((award) => award.pointThreshold > (user.participation_count || 0))

      // Generate a placeholder avatar URL
      const avatarUrl = `/placeholder.svg?height=64&width=64&query=user-${userId}`

      return NextResponse.json({
        success: true,
        profile: {
          ...user,
          avatar_url: avatarUrl, // Add placeholder avatar URL
          rank: rankData ? rankData.findIndex((u) => u.id === userId) + 1 : null,
          badges: formattedBadges,
          nft_awards: formattedNFTAwards,
          badge_count: formattedBadges.length,
          nft_count: formattedNFTAwards.length,
          next_award: nextAward
            ? {
                ...nextAward,
                pointsNeeded: nextAward.pointThreshold - (user.participation_count || 0),
              }
            : null,
        },
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)

      // Return mock profile data if database is not available
      return NextResponse.json({
        success: true,
        profile: {
          id: userId,
          name: "Demo User",
          email: "demo@example.com",
          avatar_url: `/placeholder.svg?height=64&width=64&query=user-${userId}`,
          bio: "This is a demo user profile.",
          participation_count: 1500,
          has_applied: false,
          created_at: new Date().toISOString(),
          rank: 5,
          badges: [],
          nft_awards: [],
          badge_count: 0,
          nft_count: 0,
          next_award: {
            id: "bronze",
            name: "Bronze Recruit",
            description: "Awarded for reaching 1,000 participation points",
            imageUrl: "/nft-awards/bronze-recruit.png",
            pointThreshold: 1000,
            pointsNeeded: 0,
          },
        },
      })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const { bio } = await request.json()

    // Validate input
    if (bio && bio.length > 500) {
      return NextResponse.json({ success: false, message: "Bio must be less than 500 characters" }, { status: 400 })
    }

    try {
      const serviceClient = getServiceSupabase()

      // Update user profile - removed avatar_url from update data
      const updateData: { bio?: string } = {}
      if (bio !== undefined) updateData.bio = bio

      const { error } = await serviceClient.from("users").update(updateData).eq("id", userId)

      if (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error updating user profile:", error)
      return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

// Helper functions to get badge name and description
function getBadgeName(badgeType: BadgeType): string {
  const badgeNames: Record<BadgeType, string> = {
    written: "Written Test",
    oral: "Oral Board",
    physical: "Physical Test",
    polygraph: "Polygraph",
    psychological: "Psychological",
    full: "Full Process",
    "chat-participation": "Chat Participation",
    "first-response": "First Response",
    "application-started": "Application Started",
    "application-completed": "Application Completed",
    "frequent-user": "Frequent User",
    "resource-downloader": "Resource Downloader",
    "hard-charger": "Hard Charger",
    connector: "Connector",
    "deep-diver": "Deep Diver",
    "quick-learner": "Quick Learner",
    "persistent-explorer": "Persistent Explorer",
    "dedicated-applicant": "Dedicated Applicant",
  }

  return badgeNames[badgeType] || badgeType
}

function getBadgeDescription(badgeType: BadgeType): string {
  const badgeDescriptions: Record<BadgeType, string> = {
    written: "Completed written test preparation",
    oral: "Prepared for oral board interviews",
    physical: "Completed physical test preparation",
    polygraph: "Learned about the polygraph process",
    psychological: "Prepared for psychological evaluation",
    full: "Completed all preparation areas",
    "chat-participation": "Engaged with Sgt. Ken",
    "first-response": "Received first response from Sgt. Ken",
    "application-started": "Started the application process",
    "application-completed": "Completed the application process",
    "frequent-user": "Regularly engages with the recruitment platform",
    "resource-downloader": "Downloaded recruitment resources and materials",
    "hard-charger": "Consistently asks questions and has applied",
    connector: "Connects with other participants",
    "deep-diver": "Explores topics in great detail",
    "quick-learner": "Rapidly progresses through recruitment information",
    "persistent-explorer": "Returns regularly to learn more",
    "dedicated-applicant": "Applied and continues to engage",
  }

  return badgeDescriptions[badgeType] || `Earned the ${badgeType} badge`
}
