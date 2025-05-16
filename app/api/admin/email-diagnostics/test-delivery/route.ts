import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email address is required",
      })
    }

    // Send a test email
    const result = await sendEmail({
      to: email,
      subject: "Email Delivery Test",
      html: `
        <div style="font-family: Arial, sans-serif;
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

 padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0A3C1F;">Email Delivery Test</h1>
          <p>This is a test email to verify that the email delivery system is working correctly.</p>
          <p>If you're receiving this email, it means the email delivery system is configured properly.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to send test email",
        details: result,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      details: {
        emailId: result.data?.id,
        recipient: email,
      },
    })
  } catch (error) {
    console.error("Email delivery test error:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error sending test email",
    })
  }
}
