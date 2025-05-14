import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-service"
import { createClient } from "@/lib/supabase-clients"
import { addParticipationPoints } from "@/lib/points-service"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const userType = requestUrl.searchParams.get("userType") || "recruit"
  const callbackUrl = requestUrl.searchParams.get("callbackUrl")

  // Redirect URL based on user type
  let redirectTo = "/"
  if (userType === "volunteer") {
    redirectTo = "/volunteer-dashboard"
  } else if (userType === "admin") {
    redirectTo = "/admin/dashboard"
  } else {
    redirectTo = "/dashboard"
  }

  // Use callback URL if provided
  if (callbackUrl) {
    redirectTo = callbackUrl
  }

  try {
    if (!code) {
      return NextResponse.redirect(`${requestUrl.origin}${redirectTo}?error=missing_code`)
    }

    // Create a supabase client with the provided code
    const supabase = createClient()

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(`${requestUrl.origin}${redirectTo}?error=auth_error`)
    }

    // Check if user exists in our database
    const { data: userTypeData } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", data.user.id)
      .maybeSingle()

    const isNewUser = !userTypeData

    if (isNewUser) {
      // Create new user profile for social login
      const { id, email, user_metadata } = data.user

      if (!email) {
        return NextResponse.redirect(`${requestUrl.origin}${redirectTo}?error=missing_email`)
      }

      // Extract name from metadata
      const name = user_metadata?.name || user_metadata?.full_name || email.split("@")[0]
      const avatarUrl = user_metadata?.avatar_url || user_metadata?.picture

      // Create user in recruit.users table
      await supabaseAdmin.from("recruit.users").insert({
        id,
        email,
        name,
        avatar_url: avatarUrl,
        points: 50, // Initial points
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Set user type
      await supabaseAdmin.from("user_types").insert({
        user_id: id,
        user_type: "recruit",
        email,
      })

      // Log the initial points
      await supabaseAdmin.from("user_point_logs").insert([
        {
          user_id: id,
          points: 50,
          action: "Initial signup bonus via social login",
          created_at: new Date().toISOString(),
        },
      ])

      // Award initial points
      await addParticipationPoints(id, 50, "sign_up", "Initial signup bonus via social login")
    }

    // If user is a volunteer, check if active
    if (userType === "volunteer" && !isNewUser) {
      const { data: volunteerData } = await supabaseAdmin
        .from("volunteer.recruiters")
        .select("is_active")
        .eq("id", data.user.id)
        .single()

      if (!volunteerData?.is_active) {
        return NextResponse.redirect(`${requestUrl.origin}/volunteer-pending`)
      }
    }

    // Redirect to the appropriate page
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}${isNewUser ? "?newUser=true" : ""}`)
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}?error=unexpected`)
  }
}
