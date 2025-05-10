"use server"

import { getServiceSupabase } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"
import { authConfig } from "@/lib/supabase-auth-config"

interface VolunteerRegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  position: string
  location: string
  password: string
  referralSource: string
}

export async function registerVolunteerRecruiter(data: VolunteerRegistrationData) {
  try {
    const supabase = getServiceSupabase()

    // Check if email already exists
    const { data: existingUser } = await supabase.from("auth.users").select("id").eq("email", data.email).single()

    if (existingUser) {
      return { error: "A user with this email already exists" }
    }

    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm email for simplicity
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        organization: data.organization,
        position: data.position,
        location: data.location,
        referral_source: data.referralSource,
        is_volunteer_recruiter: true,
      },
      ...authConfig.getSignUpOptions(true),
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return { error: authError.message }
    }

    // Create user profile in the database
    const { error: profileError } = await supabase.from("user_profiles").insert({
      user_id: authUser.user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      organization: data.organization,
      position: data.position,
      location: data.location,
      is_volunteer_recruiter: true,
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return { error: profileError.message }
    }

    // Assign volunteer recruiter role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authUser.user.id,
      role: "volunteer_recruiter",
      assigned_at: new Date().toISOString(),
    })

    if (roleError) {
      console.error("Error assigning role:", roleError)
      return { error: roleError.message }
    }

    // Create volunteer recruiter stats
    const { error: statsError } = await supabase.from("volunteer_recruiter_stats").insert({
      user_id: authUser.user.id,
      referrals_count: 0,
      successful_referrals: 0,
      events_participated: 0,
      last_active: new Date().toISOString(),
    })

    if (statsError) {
      console.error("Error creating recruiter stats:", statsError)
      return { error: statsError.message }
    }

    // Revalidate paths
    revalidatePath("/volunteer-login")
    revalidatePath("/volunteer-dashboard")

    return { success: true, userId: authUser.user.id }
  } catch (error) {
    console.error("Volunteer registration error:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred during registration",
    }
  }
}
