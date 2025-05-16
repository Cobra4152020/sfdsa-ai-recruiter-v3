
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { sendEmail } from "@/lib/email/send-email"
import { emailTemplates } from "@/lib/email/templates"
import { NFT_AWARD_TIERS } from "@/lib/nft-utils"

export async function POST(request: Request) {
  try {
    const { userId, nftAwardId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    if (!nftAwardId) {
      return NextResponse.json({ success: false, message: "NFT award ID is required" }, { status: 400 })
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

    // Get NFT award details
    const { data: nftAward, error: nftError } = await serviceClient
      .from("user_nft_awards")
      .select("*")
      .eq("user_id", userId)
      .eq("nft_award_id", nftAwardId)
      .single()

    if (nftError || !nftAward) {
      console.error("Error fetching NFT award:", nftError)
      return NextResponse.json({ success: false, message: "NFT award not found" }, { status: 404 })
    }

    // Get award details from the tiers
    const awardDetails = NFT_AWARD_TIERS.find((award) => award.id === nftAwardId)

    if (!awardDetails) {
      return NextResponse.json({ success: false, message: "Award details not found" }, { status: 404 })
    }

    // Generate NFT view URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000"

    const nftUrl = `${baseUrl}/nft-awards/${nftAwardId}`
    const nftImageUrl = `${baseUrl}${awardDetails.imageUrl}`

    // Send email notification using our new email utility
    const emailResult = await sendEmail({
      to: user.email,
      subject: `You've Earned the ${awardDetails.name} NFT Award!`,
      html: emailTemplates.nftAwarded({
        recipientName: user.name || "Recruit",
        nftName: awardDetails.name,
        nftDescription: awardDetails.description,
        nftImageUrl,
        tokenId: nftAward.token_id,
        contractAddress: nftAward.contract_address,
        nftUrl,
      }),
    })

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.message)
      return NextResponse.json({ success: false, message: "Failed to send email notification" }, { status: 500 })
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
