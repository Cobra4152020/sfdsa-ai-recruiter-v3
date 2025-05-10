import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { sendEmail } from "@/lib/email/send-email"
import { emailTemplates } from "@/lib/email/templates"
import { constructUrl } from "@/lib/url-utils"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
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

    // Generate login URL
    const loginUrl = constructUrl("/login")

    // Send welcome email
    const emailResult = await sendEmail({
      to: user.email,
      subject: `Welcome to the SF Deputy Sheriff Recruitment Platform!`,
      html: emailTemplates.welcome({
        recipientName: user.name || "Recruit",
        loginUrl,
      }),
    })

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.message)
      return NextResponse.json({ success: false, message: "Failed to send welcome email" }, { status: 500 })
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
