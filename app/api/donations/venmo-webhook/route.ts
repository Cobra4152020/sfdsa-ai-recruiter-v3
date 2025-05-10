import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"
import { headers } from "next/headers"
import crypto from "crypto"

// This is your Venmo webhook secret
const VENMO_WEBHOOK_SECRET = process.env.VENMO_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("venmo-signature")!

  // Verify webhook signature
  const hmac = crypto.createHmac("sha256", VENMO_WEBHOOK_SECRET)
  const expectedSignature = hmac.update(body).digest("hex")

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const supabase = createClient()

  // Handle different event types
  switch (payload.type) {
    case "payment.created":
      // Determine organization from note or username
      let organization = "both" // Default
      const note = payload.data.note?.toLowerCase() || ""
      const username = payload.data.recipient?.username?.toLowerCase() || ""

      if (username === "sfdsa-association" || (note.includes("sfdsa") && !note.includes("protecting"))) {
        organization = "sfdsa"
      } else if (username === "protecting-sf" || (note.includes("protecting") && !note.includes("sfdsa"))) {
        organization = "protecting"
      }

      // Record the donation
      await supabase.from("donations").insert({
        amount: payload.data.amount,
        donor_email: payload.data.sender.email || null,
        donor_name: payload.data.sender.display_name || null,
        message: payload.data.note || null,
        payment_processor: "venmo",
        payment_id: payload.data.id,
        status: "completed",
        venmo_username: payload.data.sender.username,
        organization,
      })

      // Send receipt if email is available
      if (payload.data.sender.email) {
        await fetch("/api/donations/send-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: payload.data.sender.email,
            amount: payload.data.amount,
            donationId: payload.data.id,
            isRecurring: false,
            organization,
          }),
        })
      }
      break

    default:
      console.log(`Unhandled event type ${payload.type}`)
  }

  return NextResponse.json({ received: true })
}
