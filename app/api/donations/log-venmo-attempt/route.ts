import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { amount, donorName, donorEmail } = await request.json()

    if (!amount || !donorEmail) {
      return NextResponse.json({ error: "Amount and email are required" }, { status: 400 })
    }

    // Log the Venmo donation attempt
    const supabase = createClient()
    await supabase.from("donations").insert({
      amount: Number.parseFloat(amount),
      donor_email: donorEmail,
      donor_name: donorName || null,
      payment_processor: "venmo",
      payment_id: "pending-" + Date.now(),
      status: "pending",
      venmo_attempt: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging Venmo attempt:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
