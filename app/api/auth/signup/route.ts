
export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, userType = "recruit", name } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name,
          user_type: userType,
        },
      },
    })

    if (authError) throw authError

    if (authData.user) {
      // 2. Add user type record
      const { error: typeError } = await supabase
        .from("user_types")
        .insert({
          user_id: authData.user.id,
          user_type: userType,
        })

      if (typeError) throw typeError

      // 3. Create user profile based on type
      if (userType === "recruit") {
        const { error: recruitError } = await supabase
          .from("recruit.users")
          .insert({
            id: authData.user.id,
            name,
            email,
            points: 50, // Initial points for new recruits
            has_applied: false,
            registration_date: new Date().toISOString(),
          })

        if (recruitError) throw recruitError

        // 4. Add points history entry
        const { error: pointsError } = await supabase
          .from("points_history")
          .insert({
            user_id: authData.user.id,
            points: 50,
            reason: "Registration bonus",
            type: "registration",
          })

        if (pointsError) throw pointsError

      } else if (userType === "volunteer") {
        const { error: volunteerError } = await supabase
          .from("volunteer.recruiters")
          .insert({
            id: authData.user.id,
            name,
            email,
            is_active: false, // Volunteers need approval
            registration_date: new Date().toISOString(),
          })

        if (volunteerError) throw volunteerError
      }

      return NextResponse.json({
        message: "Registration successful",
        userType,
        initialPoints: userType === "recruit" ? 50 : 0,
      })
    }

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Registration failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 400 }
    )
  }
} 