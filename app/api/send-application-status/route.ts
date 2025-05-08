import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { sendEmail } from "@/lib/email/send-email"
import { emailTemplates } from "@/lib/email/templates"

export async function POST(request: Request) {
  try {
    const { userId, statusUpdate, nextSteps } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    if (!statusUpdate) {
      return NextResponse.json({ success: false, message: "Status update is required" }, { status: 400 })
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

    // Generate dashboard URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000"

    const dashboardUrl = `${baseUrl}/profile/${userId}`

    // Send application status email
    const emailResult = await sendEmail({
      to: user.email,
      subject: `Application Status Update - SF Deputy Sheriff Recruitment`,
      html: emailTemplates.applicationStatus({
        recipientName: user.name || "Recruit",
        statusUpdate,
        nextSteps: nextSteps || [],
        dashboardUrl,
      }),
    })

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.message)
      return NextResponse.json({ success: false, message: "Failed to send application status email" }, { status: 500 })
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
