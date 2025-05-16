
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"
import { emailTemplates } from "@/lib/email/templates"
import { constructUrl } from "@/lib/url-utils"

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, status, trackingNumber } = await request.json()

    if (!email || !firstName || !status || !trackingNumber) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Get the appropriate template based on status
    const templateFunction = emailTemplates.getStatusTemplate(status)

    // Generate the dashboard URL
    const dashboardUrl = constructUrl(`/applicant/dashboard?tracking=${trackingNumber}`)

    // Generate the application URL
    const applicationUrl = "https://careers.sf.gov/interest/public-safety/sheriff/"

    // Generate the email HTML using the template
    const html = templateFunction({
      firstName,
      lastName,
      trackingNumber,
      dashboardUrl,
      applicationUrl,
    })

    // Determine the subject line based on status
    let subject = "Your Application Status Update"
    switch (status.toLowerCase()) {
      case "pending":
        subject = "Application Received - San Francisco Deputy Sheriff"
        break
      case "contacted":
        subject = "We've Reached Out - San Francisco Deputy Sheriff"
        break
      case "interested":
        subject = "Next Steps in Your Application - San Francisco Deputy Sheriff"
        break
      case "applied":
        subject = "Application Confirmed - San Francisco Deputy Sheriff"
        break
      case "hired":
        subject = "Congratulations! You're Hired - San Francisco Deputy Sheriff"
        break
      case "rejected":
        subject = "Application Status Update - San Francisco Deputy Sheriff"
        break
    }

    // Send the email
    const result = await sendEmail({
      to: email,
      subject,
      html,
    })

    if (!result.success) {
      console.error("Failed to send email:", result.message)
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending application status email:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
