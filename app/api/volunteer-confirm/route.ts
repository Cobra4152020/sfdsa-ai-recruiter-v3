
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const isTest = searchParams.get("test") === "true"

    // For test requests, just return a success response
    if (isTest) {
      return NextResponse.json({
        success: true,
        message: "Test endpoint is working",
      })
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No confirmation token provided",
        },
        { status: 400 },
      )
    }

    const supabase = getServiceSupabase()

    // Find the token in the database
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .select("*")
      .eq("token", token)
      .eq("type", "volunteer_recruiter")
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired confirmation token",
        },
        { status: 400 },
      )
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Confirmation token has expired. Please register again.",
        },
        { status: 400 },
      )
    }

    // Check if token is already used
    if (tokenData.used_at) {
      return NextResponse.json(
        {
          success: false,
          message: "This email has already been confirmed",
        },
        { status: 400 },
      )
    }

    // Mark token as used
    await supabase
      .from("email_confirmation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenData.id)

    // Find the user by email
    const { data: userData, error: userError } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", tokenData.email)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please register again.",
        },
        { status: 400 },
      )
    }

    // Update user profile to mark email as confirmed
    await supabase.from("user_profiles").update({ is_email_confirmed: true }).eq("user_id", userData.user_id)

    // Activate the volunteer recruiter role
    await supabase
      .from("user_roles")
      .update({ is_active: true })
      .eq("user_id", userData.user_id)
      .eq("role", "volunteer_recruiter")

    // Update Supabase Auth user to confirm email
    await supabase.auth.admin.updateUserById(userData.user_id, {
      email_confirm: true,
    })

    return NextResponse.json({
      success: true,
      message: "Your email has been confirmed successfully. You can now log in to your volunteer recruiter account.",
      email: tokenData.email,
    })
  } catch (error) {
    console.error("Error confirming volunteer email:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while confirming your email",
      },
      { status: 500 },
    )
  }
}
