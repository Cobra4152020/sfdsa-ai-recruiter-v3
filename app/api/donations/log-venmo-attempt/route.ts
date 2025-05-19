export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { amount, donorName, donorEmail } = await request.json()

    if (!amount || !donorEmail) {
      return NextResponse.json({ error: "Amount and email are required" }, { status: 400 })
    }

    // Log the Venmo donation attempt
    const supabase = getServiceSupabase()
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
