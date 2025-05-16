import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"
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

    const serviceClient = getServiceSupabase()

    // Fetch user's badges
    const { data: badges, error } = await serviceClient
      .from("badges")
      .select("id, user_id, badge_type, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })

    if (error) {
      console.error("Error fetching user badges:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch badges" }, { status: 500 })
    }

    // Enhance badges with name and description
    const enhancedBadges = badges.map((badge) => ({
      ...badge,
      name: getBadgeName(badge.badge_type),
      description: getBadgeDescription(badge.badge_type),
    }))

    return NextResponse.json({ success: true, badges: enhancedBadges })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const { badge_type } = await request.json()

    if (!badge_type) {
      return NextResponse.json({ success: false, message: "Badge type is required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await serviceClient
      .from("badges")
      .select("id, badge_type, earned_at")
      .eq("user_id", userId)
      .eq("badge_type", badge_type)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing badge:", checkError)
      return NextResponse.json({ success: false, message: "Failed to check for existing badge" }, { status: 500 })
    }

    if (existingBadge) {
      return NextResponse.json({
        success: false,
        message: "User already has this badge",
        badge: {
          ...existingBadge,
          name: getBadgeName(existingBadge.badge_type),
          description: getBadgeDescription(existingBadge.badge_type),
        },
      })
    }

    // Add the badge
    const { data, error } = await serviceClient
      .from("badges")
      .insert([
        {
          user_id: userId,
          badge_type,
        },
      ])
      .select()

    if (error) {
      console.error("Error adding badge:", error)
      return NextResponse.json({ success: false, message: "Failed to add badge" }, { status: 500 })
    }

    // Enhance the badge with name and description
    const enhancedBadge = {
      ...data[0],
      name: getBadgeName(data[0].badge_type),
      description: getBadgeDescription(data[0].badge_type),
    }

    return NextResponse.json({ success: true, badge: enhancedBadge })
  } catch (error) {
    console.error("Error awarding badge:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
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
