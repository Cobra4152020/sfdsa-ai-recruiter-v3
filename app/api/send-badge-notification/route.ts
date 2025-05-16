
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { sendEmail } from "@/lib/email/send-email"
import { emailTemplates } from "@/lib/email/templates"

export async function POST(request: Request) {
  try {
    const { userId, badgeName, badgeDescription, badgeShareMessage } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    if (!badgeName) {
      return NextResponse.json({ success: false, message: "Badge name is required" }, { status: 400 })
    }

    // Get user email
    const serviceClient = getServiceSupabase()
    const { data: user, error: userError } = await serviceClient
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // If no email, return early
    if (!user.email) {
      return NextResponse.json({
        success: false,
        message: "User has no email address",
      })
    }

    // Generate badge URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000"

    const badgeUrl = `${baseUrl}/user-badge/${encodeURIComponent(user.name || "Recruit")}`

    // Send email notification using our new email utility
    const emailResult = await sendEmail({
      to: user.email,
      subject: `You've Earned the ${badgeName} Badge!`,
      html: emailTemplates.badgeEarned({
        recipientName: user.name || "Recruit",
        badgeName,
        badgeDescription,
        badgeShareMessage,
        badgeUrl,
      }),
    })

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.message)
      return NextResponse.json({ success: false, message: "Failed to send email notification" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.data?.id,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
