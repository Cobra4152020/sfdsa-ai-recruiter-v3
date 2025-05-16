
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import type { BadgeType } from "@/lib/badge-utils"
import { createNotification } from "@/lib/notification-service"

/**
 * This API route provides a unified way to award badges and handle all related actions:
 * 1. Award the badge in the database
 * 2. Update user participation stats if needed
 * 3. Send a notification email
 * 4. Create a real-time notification
 */
export async function POST(request: Request) {
  try {
    const { userId, badgeType, badgeName, badgeDescription, participationPoints, shareMessage } = await request.json()

    if (!userId || !badgeType) {
      return NextResponse.json({ success: false, message: "User ID and badge type are required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // 1. Check if user exists
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("id, name, email, participation_count")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      console.error("Error fetching user:", userError)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // 2. Check if user already has this badge
    const { data: existingBadge, error: checkError } = await serviceClient
      .from("badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_type", badgeType)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing badge:", checkError)
      return NextResponse.json({ success: false, message: "Failed to check for existing badge" }, { status: 500 })
    }

    let badge
    let alreadyEarned = false

    if (existingBadge) {
      badge = existingBadge
      alreadyEarned = true
    } else {
      // 3. Award the badge
      const { data, error } = await serviceClient
        .from("badges")
        .insert([
          {
            user_id: userId,
            badge_type: badgeType,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding badge:", error)
        return NextResponse.json({ success: false, message: "Failed to add badge" }, { status: 500 })
      }

      badge = data[0]

      // 4. Update participation points if specified
      if (participationPoints && participationPoints > 0) {
        const newCount = (user.participation_count || 0) + participationPoints

        const { error: updateError } = await serviceClient
          .from("users")
          .update({ participation_count: newCount })
          .eq("id", userId)

        if (updateError) {
          console.error("Error updating participation count:", updateError)
          // Continue with the process even if updating points fails
        }
      }

      // 5. Create a real-time notification for the badge award
      const name = badgeName || getBadgeName(badgeType as BadgeType)
      const description = badgeDescription || getBadgeDescription(badgeType as BadgeType)

      await createNotification({
        user_id: userId,
        type: "badge",
        title: `You earned the ${name} badge!`,
        message: description,
        image_url: `/badge-images/${badgeType}.png`, // Adjust path as needed
        action_url: `/badge/${badgeType}`,
        metadata: {
          badgeType,
          badgeName: name,
        },
      })
    }

    // 6. Send notification email if badge was just earned
    let notificationSent = false

    if (!alreadyEarned && user.email) {
      try {
        const name = badgeName || getBadgeName(badgeType as BadgeType)
        const description = badgeDescription || getBadgeDescription(badgeType as BadgeType)
        const message = shareMessage || "Keep up the great work on your journey to joining the SF Sheriff's Office!"

        const notificationResponse = await fetch(
          `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/send-badge-notification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              badgeName: name,
              badgeDescription: description,
              badgeShareMessage: message,
            }),
          },
        )

        const notificationData = await notificationResponse.json()
        notificationSent = notificationData.success
      } catch (notificationError) {
        console.error("Error sending badge notification:", notificationError)
        // Continue with the process even if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      badge: {
        ...badge,
        name: badgeName || getBadgeName(badgeType as BadgeType),
        description: badgeDescription || getBadgeDescription(badgeType as BadgeType),
      },
      alreadyEarned,
      notificationSent,
    })
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
