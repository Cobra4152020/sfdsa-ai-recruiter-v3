import { supabase } from "@/lib/supabase/index"

export interface AuthResult {
  success: boolean
  message: string
  userId?: string
  userType?: string
  error?: any
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    if (!supabase) throw new Error('Supabase client is not available on the server. This must be used on the client.');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        }
      }

      if (!data.user) {
        return {
          success: false,
          message: "Authentication failed. Please try again.",
        }
      }

      // Determine user type
      const { data: userTypeData } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .single()

      const userType = userTypeData?.user_type || "recruit"

      return {
        success: true,
        message: "Login successful",
        userId: data.user.id,
        userType,
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
      }
    }
  },

  /**
   * Get current session with user type
   */
  async getSessionWithUserType() {
    if (!supabase) throw new Error('Supabase client is not available on the server. This must be used on the client.');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return { session: null, userType: null }
      }

      // Get user type
      const { data: userTypeData } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", session.user.id)
        .single()

      return {
        session,
        userType: userTypeData?.user_type || null,
      }
    } catch (error) {
      console.error("Error getting session with user type:", error)
      return { session: null, userType: null }
    }
  },

  /**
   * Check if user is a recruit
   */
  async isRecruit(userId: string): Promise<boolean> {
    if (!supabase) throw new Error('Supabase client is not available on the server. This must be used on the client.');

    try {
      const { data } = await supabase.from("user_types").select("user_type").eq("user_id", userId).single()

      return data?.user_type === "recruit"
    } catch (error) {
      console.error("Error checking if user is recruit:", error)
      return false
    }
  },

  /**
   * Check if user is a volunteer recruiter
   */
  async isVolunteerRecruiter(userId: string): Promise<boolean> {
    if (!supabase) throw new Error('Supabase client is not available on the server. This must be used on the client.');

    try {
      const { data } = await supabase.from("user_types").select("user_type").eq("user_id", userId).single()

      return data?.user_type === "volunteer"
    } catch (error) {
      console.error("Error checking if user is volunteer recruiter:", error)
      return false
    }
  },

  /**
   * Send a magic link for passwordless login
   */
  async sendMagicLink(email: string, redirectUrl: string): Promise<AuthResult> {
    if (!supabase) throw new Error('Supabase client is not available on the server. This must be used on the client.');

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
}
