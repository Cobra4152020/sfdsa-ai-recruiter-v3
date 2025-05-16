
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { diagnoseUserAuth } from "@/lib/auth-diagnostic"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 },
      )
    }

    const supabase = getServiceSupabase()
    const diagnostic = await diagnoseUserAuth(email)
    const fixes: string[] = []

    // Fix 1: If user exists in auth but not in user_profiles
    if (diagnostic.authUserExists && !diagnostic.userProfileExists && diagnostic.authUserId) {
      // Get user details from auth.users
      const { data: authUser } = await supabase
        .from("auth.users")
        .select("id, email, raw_user_meta_data")
        .eq("id", diagnostic.authUserId)
        .single()

      if (authUser && authUser.raw_user_meta_data) {
        const metadata = authUser.raw_user_meta_data as any

        // Create user profile
        await supabase.from("user_profiles").insert({
          user_id: authUser.id,
          email: authUser.email,
          first_name: metadata.first_name || metadata.firstName || "",
          last_name: metadata.last_name || metadata.lastName || "",
          is_volunteer_recruiter: metadata.is_volunteer_recruiter === true,
          is_email_confirmed: false,
        })

        fixes.push("Created missing user profile")
      }
    }

    // Fix 2: If user exists in user_profiles but not in auth.users
    // This is more complex and would require creating an auth user, which we'll skip for safety

    // Fix 3: Fix email confirmation status mismatch
    if (diagnostic.authUserExists && diagnostic.userProfileExists && diagnostic.authUserId) {
      // Get auth user details
      const { data: authUser } = await supabase
        .from("auth.users")
        .select("email_confirmed_at")
        .eq("id", diagnostic.authUserId)
        .single()

      if (authUser) {
        const isConfirmedInAuth = !!authUser.email_confirmed_at

        if (isConfirmedInAuth !== !!diagnostic.isEmailConfirmed) {
          // Update user_profiles to match auth status
          await supabase
            .from("user_profiles")
            .update({ is_email_confirmed: isConfirmedInAuth })
            .eq("user_id", diagnostic.authUserId)

          fixes.push("Fixed email confirmation status mismatch")
        }
      }
    }

    // Fix 4: Fix volunteer recruiter role issues
    if (
      diagnostic.userProfileExists &&
      diagnostic.isVolunteerRecruiter &&
      !diagnostic.hasUserRole &&
      diagnostic.userProfileId
    ) {
      // Add missing role
      await supabase.from("user_roles").insert({
        user_id: diagnostic.userProfileId,
        role: "volunteer_recruiter",
        assigned_at: new Date().toISOString(),
        is_active: false, // Set to false until email is confirmed
      })

      fixes.push("Added missing volunteer recruiter role")
    }

    // Fix 5: Update role active status based on email confirmation
    if (diagnostic.userProfileExists && diagnostic.hasUserRole && diagnostic.userProfileId) {
      await supabase
        .from("user_roles")
        .update({ is_active: !!diagnostic.isEmailConfirmed })
        .eq("user_id", diagnostic.userProfileId)
        .eq("role", "volunteer_recruiter")

      fixes.push("Updated role active status based on email confirmation")
    }

    return NextResponse.json({
      success: true,
      fixes,
      message: fixes.length > 0 ? "Issues fixed successfully" : "No issues to fix",
    })
  } catch (error) {
    console.error("Error fixing auth issues:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
