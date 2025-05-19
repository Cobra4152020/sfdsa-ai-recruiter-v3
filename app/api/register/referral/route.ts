export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { userId, referralCode } = await request.json()

    if (!userId || !referralCode) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Check if it's a tracking ID format (REC-timestamp-random)
    const isTrackingId = referralCode.startsWith("REC-") && referralCode.split("-").length === 3

    if (isTrackingId) {
      // Find the original contact entry
      const { data: contactData, error: contactError } = await supabase
        .from("recruit_contacts")
        .select("recruiter_id, recruit_email")
        .eq("tracking_id", referralCode)
        .single()

      if (contactError) {
        console.error("Error finding contact:", contactError)
        return NextResponse.json({ success: false, message: "Invalid referral code" }, { status: 400 })
      }

      // Update the contact status
      await supabase
        .from("recruit_contacts")
        .update({ status: "signed_up", clicked_at: new Date().toISOString() })
        .eq("tracking_id", referralCode)

      // Add conversion record
      await supabase.from("referral_conversions").insert({
        recruit_id: userId,
        tracking_id: referralCode,
        status: "signed_up",
      })

      // Update user profile
      await supabase
        .from("user_profiles")
        .update({
          referred_by: contactData?.recruiter_id || null,
          referral_tracking_id: referralCode,
        })
        .eq("id", userId)

      // Send notification email to admin
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/notifications/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "email@protectingsanfrancisco.com",
          subject: "New Referral Sign-up",
          text: `A new user has signed up using a referral link with tracking ID: ${referralCode}.\n\nUser ID: ${userId}`,
        }),
      })

      return NextResponse.json({ success: true, message: "Referral tracked successfully" })
    }

    // If not a tracking ID, check if it's a regular referral code
    const { data: linkData, error: linkError } = await supabase
      .from("referral_links")
      .select("id, recruiter_id")
      .eq("code", referralCode)
      .eq("is_active", true)
      .single()

    if (linkError) {
      console.error("Error finding referral link:", linkError)
      return NextResponse.json({ success: false, message: "Invalid referral code" }, { status: 400 })
    }

    // Add conversion record
    await supabase.from("referral_conversions").insert({
      link_id: linkData.id,
      recruit_id: userId,
      status: "signed_up",
    })

    // Update user profile
    await supabase
      .from("user_profiles")
      .update({
        referred_by: linkData.recruiter_id,
      })
      .eq("id", userId)

    // Send notification email to admin
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/notifications/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "email@protectingsanfrancisco.com",
        subject: "New Referral Sign-up",
        text: `A new user has signed up using a referral link with code: ${referralCode}.\n\nUser ID: ${userId}`,
      }),
    })

    return NextResponse.json({ success: true, message: "Referral tracked successfully" })
  } catch (error) {
    console.error("Error tracking referral:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
