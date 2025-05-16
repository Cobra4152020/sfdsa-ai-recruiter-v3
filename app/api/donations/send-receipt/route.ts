import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"
import { sendEmail } from "@/lib/email/send-email"
import { donationReceiptTemplate } from "@/lib/email/templates/donation-receipt"

export async function POST(request: Request) {
  try {
    const { email, amount, donationId, isRecurring } = await request.json()

    if (!email || !amount || !donationId) {
      return NextResponse.json({ error: "Email, amount, and donationId are required" }, { status: 400 })
    }

    // Get donation details from database
    const supabase = createClient()
    const { data: donation } = await supabase.from("donations").select("*").eq("payment_id", donationId).single()

    // Send receipt email
    await sendEmail({
      to: email,
      subject: "Thank You for Your Donation to SFDSA",
      html: donationReceiptTemplate({
        amount,
        donorName: donation?.donor_name || "Supporter",
        donationDate: new Date().toLocaleDateString(),
        donationId,
        isRecurring,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending receipt:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
