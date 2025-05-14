import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const userType = requestUrl.searchParams.get("user_type") || "recruit"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from(userType === "volunteer" ? "volunteer_users" : userType === "admin" ? "admin_users" : "recruit_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle()

      // If profile doesn't exist, create it
      if (!existingProfile && !profileCheckError) {
        // Get user metadata
        const fullName =
          user.user_metadata?.full_name ||
          `${user.user_metadata?.name || ""} ${user.user_metadata?.family_name || ""}`.trim() ||
          user.user_metadata?.name ||
          "User"

        // Create profile in appropriate table
        await supabase
          .from(userType === "volunteer" ? "volunteer_users" : userType === "admin" ? "admin_users" : "recruit_users")
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: fullName,
            created_at: new Date().toISOString(),
          })

        // Award 50 points to new recruit users
        if (userType === "recruit") {
          await supabase.from("user_points").insert({
            user_id: user.id,
            points: 50,
            reason: "Welcome bonus",
            created_at: new Date().toISOString(),
          })
        }
      }
    }
  }

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url))
}
