export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, status, trackingNumber } = await request.json()

    // TODO: Add your email sending logic here
    // For now, we'll just log it to the database

    // Log the email send in the database
    const supabase = getServiceSupabase()
    const { error } = await supabase.from("email_logs").insert({
      email_type: "application_status",
      recipient_email: email,
      recipient_name: `${firstName} ${lastName}`,
      status,
      tracking_number: trackingNumber,
      sent_at: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in send-application-status:", error)
    return NextResponse.json(
      { error: "Failed to send application status email" },
      { status: 500 }
    )
  }
}
