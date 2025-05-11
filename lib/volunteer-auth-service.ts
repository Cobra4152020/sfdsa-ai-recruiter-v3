import { supabase } from "@/lib/supabase-client"

export interface VolunteerLoginResult {
  success: boolean
  message: string
  userId?: string
  error?: any
}

export const volunteerAuthService = {
  /**
   * Authenticate a volunteer recruiter
   */
  async login(email: string, password: string): Promise<VolunteerLoginResult> {
    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        return {
          success: false,
          message: signInError.message,
          error: signInError,
        }
      }

      if (!data.user) {
        return {
          success: false,
          message: "Authentication failed. Please try again.",
        }
      }

      // Check if user has volunteer_recruiter role
      const { data: userRoles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single()

      if (roleError || !userRoles || userRoles.role !== "volunteer_recruiter") {
        return {
          success: false,
          message: "You do not have volunteer recruiter access. Please contact support.",
          userId: data.user.id,
        }
      }

      return {
        success: true,
        message: "Login successful",
        userId: data.user.id,
      }
    } catch (error) {
      console.error("Volunteer login error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
      }
    }
  },

  /**
   * Send a magic link to the volunteer recruiter
   */
  async sendMagicLink(email: string, redirectUrl: string): Promise<VolunteerLoginResult> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        }
      }

      return {
        success: true,
        message: "Magic link sent successfully",
      }
    } catch (error) {
      console.error("Magic link error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send magic link",
        error,
      }
    }
  },

  /**
   * Check if a user is a volunteer recruiter
   */
  async isVolunteerRecruiter(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "volunteer_recruiter")
        .single()

      if (error || !data) {
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking volunteer status:", error)
      return false
    }
  },
}
