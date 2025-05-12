import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { constructUrl } from "@/lib/url-utils"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const serviceClient = getServiceSupabase()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return NextResponse.json({ success: false, message: authError.message }, { status: 500 })
    }

    const userId = authData.user.id

    // Create user profile in the database
    // FIXED: Give new users initial points (50) to appear on the leaderboard
    // Use RPC call instead of direct insert to handle materialized view permissions
    const { error: profileError } = await serviceClient.rpc("create_new_user", {
      user_id: userId,
      user_name: name || email.split("@")[0],
      user_email: email,
      initial_points: 50,
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)

      // Fallback to direct insert if RPC fails
      try {
        const { error: insertError } = await serviceClient.from("users").insert([
          {
            id: userId,
            name: name || email.split("@")[0],
            email,
            created_at: new Date().toISOString(),
            participation_count: 50, // Initial points for new users
            has_applied: false,
          },
        ])

        if (insertError) {
          throw insertError
        }
      } catch (fallbackError) {
        console.error("Fallback insert failed:", fallbackError)
        return NextResponse.json({ success: false, message: "Failed to create user profile" }, { status: 500 })
      }
    }

    // Log the initial points
    try {
      await serviceClient.from("user_point_logs").insert([
        {
          user_id: userId,
          points: 50,
          action: "Initial signup bonus",
          created_at: new Date().toISOString(),
        },
      ])
    } catch (logError) {
      console.error("Error logging initial points:", logError)
      // Don't fail registration if logging fails
    }

    // Send welcome email
    try {
      await fetch(constructUrl("/api/send-welcome-email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name || email.split("@")[0],
        email,
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
