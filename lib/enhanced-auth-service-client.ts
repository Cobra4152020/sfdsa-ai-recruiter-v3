import { supabase } from "@/lib/supabase/index"
import type { Provider } from "@supabase/supabase-js"
import type { AuthResult, UserRole, SocialProvider, UserProfile } from "./enhanced-auth-service"

export const enhancedAuthService = {
  async signInWithSocialProvider(provider: Provider): Promise<AuthResult> {
    if (!supabase) {
      return {
        success: false,
        message: "Supabase client is not initialized.",
      }
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        }
      }
      return {
        success: true,
        message: "Redirecting to provider...",
        redirectUrl: data?.url,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error,
      }
    }
  },
  // All other methods throw if called on the client
  async signInWithPassword() {
    throw new Error("signInWithPassword is only available on the server.")
  },
  async handleSocialAuthCallback() {
    throw new Error("handleSocialAuthCallback is only available on the server.")
  },
  async registerRecruit() {
    throw new Error("registerRecruit is only available on the server.")
  },
  async signOut() {
    if (!supabase) {
      throw new Error("Supabase client is not initialized.")
    }
    return supabase.auth.signOut()
  },
  async getSession() {
    if (!supabase) {
      throw new Error("Supabase client is not initialized.")
    }
    return supabase.auth.getSession()
  },
  getRedirectUrlForUserRole() {
    throw new Error("getRedirectUrlForUserRole is only available on the server.")
  },
  async getUserProfile() {
    throw new Error("getUserProfile is only available on the server.")
  },
} 