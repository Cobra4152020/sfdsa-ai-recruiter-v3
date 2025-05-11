import { supabase } from "@/lib/supabase-client-singleton"

export interface AuthResult {
  success: boolean
  message: string
  userId?: string
  error?: any
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
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

      return {
        success: true,
        message: "Login successful",
        userId: data.user?.id,
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
   * Sign in with magic link
   */
  async signInWithMagicLink(email: string, redirectUrl: string): Promise<AuthResult> {
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
   * Reset password
   */
  async resetPassword(email: string, redirectUrl: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
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
        message: "Password reset email sent successfully",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send password reset email",
        error,
      }
    }
  },

  /**
   * Update password
   */
  async updatePassword(password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
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
        message: "Password updated successfully",
      }
    } catch (error) {
      console.error("Update password error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update password",
        error,
      }
    }
  },

  /**
   * Sign out
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        }
      }

      return {
        success: true,
        message: "Signed out successfully",
      }
    } catch (error) {
      console.error("Sign out error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to sign out",
        error,
      }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    return await supabase.auth.getSession()
  },

  /**
   * Get current user
   */
  async getUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },
}
