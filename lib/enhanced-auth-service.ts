import { createClient } from "@/lib/supabase-clients"
import { supabase } from "@/lib/supabase-client-singleton"
import { supabaseAdmin } from "@/lib/supabase-service"
import { constructUrl } from "@/lib/url-utils"
import { addParticipationPoints } from "@/lib/points-service"
import type { Provider } from "@supabase/supabase-js"

// User types
export type UserRole = "recruit" | "volunteer" | "admin"

// Social provider types
export type SocialProvider = "google" | "facebook" | "twitter" | "github" | "apple" | "linkedin"

// Login methods
export type LoginMethod = "password" | "social" | "magic_link" | "sso"

// Authentication result interface
export interface AuthResult {
  success: boolean
  message: string
  userId?: string
  userRole?: UserRole
  email?: string
  name?: string
  error?: any
  redirectUrl?: string
  isNewUser?: boolean
  sessionToken?: string
  performanceMetrics?: {
    totalTimeMs: number
    databaseTimeMs: number
    tokenGenerationTimeMs: number
    userFetchTimeMs: number
  }
}

// User profile interface
export interface UserProfile {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  userRole: UserRole
  isActive?: boolean
  avatarUrl?: string
  createdAt?: string
  providers?: SocialProvider[]
  phoneNumber?: string
  address?: string
  preferences?: Record<string, any>
  lastLoginAt?: string
  loginCount?: number
}

/**
 * Enhanced Authentication Service
 * Handles secure authentication for all user roles with performance optimization
 */
export class EnhancedAuthService {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(
    email: string,
    password: string,
    options?: {
      rememberMe?: boolean
      captchaToken?: string
    },
  ): Promise<AuthResult> {
    const startTime = performance.now()
    let databaseTime = 0
    let tokenGenTime = 0
    let userFetchTime = 0

    try {
      // Record login attempt for analytics
      await this.recordLoginAttempt({
        email,
        method: "password",
        userAgent: this.getUserAgent(),
        ipAddress: "client-side", // Will be updated server-side
      })

      // Authenticate with Supabase
      const authStart = performance.now()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      tokenGenTime = performance.now() - authStart

      if (error) {
        await this.recordLoginError({
          email,
          errorType: "auth/invalid-credential",
          errorMessage: error.message,
          method: "password",
        })

        return {
          success: false,
          message: error.message,
          error,
          performanceMetrics: {
            totalTimeMs: performance.now() - startTime,
            databaseTimeMs: databaseTime,
            tokenGenerationTimeMs: tokenGenTime,
            userFetchTimeMs: userFetchTime,
          },
        }
      }

      if (!data.user) {
        return {
          success: false,
          message: "Authentication failed. Please try again.",
          performanceMetrics: {
            totalTimeMs: performance.now() - startTime,
            databaseTimeMs: databaseTime,
            tokenGenerationTimeMs: tokenGenTime,
            userFetchTimeMs: userFetchTime,
          },
        }
      }

      // Get user type and profile
      const fetchStart = performance.now()
      const userProfile = await this.getUserProfile(data.user.id)
      userFetchTime = performance.now() - fetchStart

      if (!userProfile) {
        return {
          success: false,
          message: "User profile not found. Please contact support.",
          performanceMetrics: {
            totalTimeMs: performance.now() - startTime,
            databaseTimeMs: databaseTime,
            tokenGenerationTimeMs: tokenGenTime,
            userFetchTimeMs: userFetchTime,
          },
        }
      }

      // Update last login timestamp
      const updateStart = performance.now()
      await this.updateLoginStatistics(data.user.id, userProfile.userRole)
      databaseTime += performance.now() - updateStart

      // Record successful login
      await this.recordSuccessfulLogin({
        userId: data.user.id,
        email,
        method: "password",
        userRole: userProfile.userRole,
      })

      // Determine redirect URL based on user role
      const redirectUrl = this.getRedirectUrlForUserRole(userProfile.userRole)

      // Check if volunteer is active
      if (userProfile.userRole === "volunteer" && !userProfile.isActive) {
        return {
          success: true,
          message: "Your volunteer account is pending approval.",
          userId: data.user.id,
          userRole: userProfile.userRole,
          email: userProfile.email,
          name: userProfile.name,
          redirectUrl: "/volunteer-pending",
          performanceMetrics: {
            totalTimeMs: performance.now() - startTime,
            databaseTimeMs: databaseTime,
            tokenGenerationTimeMs: tokenGenTime,
            userFetchTimeMs: userFetchTime,
          },
        }
      }

      return {
        success: true,
        message: "Login successful",
        userId: data.user.id,
        userRole: userProfile.userRole,
        email: userProfile.email,
        name: userProfile.name,
        redirectUrl,
        sessionToken: data.session?.access_token,
        performanceMetrics: {
          totalTimeMs: performance.now() - startTime,
          databaseTimeMs: databaseTime,
          tokenGenerationTimeMs: tokenGenTime,
          userFetchTimeMs: userFetchTime,
        },
      }
    } catch (error) {
      console.error("Sign in error:", error)

      await this.recordLoginError({
        email,
        errorType: "auth/unexpected-error",
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
        method: "password",
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
        performanceMetrics: {
          totalTimeMs: performance.now() - startTime,
          databaseTimeMs: databaseTime,
          tokenGenerationTimeMs: tokenGenTime,
          userFetchTimeMs: userFetchTime,
        },
      }
    }
  }

  /**
   * Sign in with social provider
   */
  async signInWithSocialProvider(provider: Provider): Promise<AuthResult> {
    const startTime = performance.now()

    try {
      await this.recordLoginAttempt({
        method: `social/${provider}`,
        userAgent: this.getUserAgent(),
        ipAddress: "client-side",
      })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: constructUrl(`/auth/callback?provider=${provider}`),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        await this.recordLoginError({
          errorType: "auth/social-provider-error",
          errorMessage: error.message,
          method: `social/${provider}`,
        })

        return {
          success: false,
          message: error.message,
          error,
        }
      }

      if (!data.url) {
        return {
          success: false,
          message: "Failed to generate authentication URL",
        }
      }

      // Return success with the URL to redirect to
      return {
        success: true,
        message: "Redirecting to provider...",
        redirectUrl: data.url,
      }
    } catch (error) {
      console.error("Social sign in error:", error)

      await this.recordLoginError({
        errorType: "auth/unexpected-error",
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
        method: `social/${provider}`,
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to authenticate with provider",
        error,
      }
    }
  }

  /**
   * Handle social auth callback
   */
  async handleSocialAuthCallback(code: string, provider: string): Promise<AuthResult> {
    const startTime = performance.now()
    let databaseTime = 0

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error || !data.user) {
        await this.recordLoginError({
          errorType: "auth/social-callback-error",
          errorMessage: error?.message || "Authentication failed",
          method: `social/${provider}`,
        })

        return {
          success: false,
          message: error?.message || "Authentication failed",
          error,
        }
      }

      // Check if user exists in our system
      const dbStart = performance.now()
      const { data: userTypeData } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle()
      databaseTime = performance.now() - dbStart

      let isNewUser = false
      let userRole: UserRole = "recruit" // Default to recruit for social logins

      if (!userTypeData) {
        isNewUser = true

        // Create new user profile for social login
        const createStart = performance.now()
        await this.createUserProfileFromSocialLogin(data.user, provider as SocialProvider)
        databaseTime += performance.now() - createStart

        // Award initial points for new users
        await addParticipationPoints(data.user.id, 50, "sign_up", "Initial signup bonus via social login")
      } else {
        userRole = userTypeData.user_type as UserRole
      }

      // Update last login timestamp
      const updateStart = performance.now()
      await this.updateLoginStatistics(data.user.id, userRole)
      databaseTime += performance.now() - updateStart

      // Record successful login
      await this.recordSuccessfulLogin({
        userId: data.user.id,
        email: data.user.email || "",
        method: `social/${provider}`,
        userRole,
      })

      // Get redirect URL based on user role
      const redirectUrl = this.getRedirectUrlForUserRole(userRole)

      return {
        success: true,
        message: isNewUser ? "Account created successfully" : "Login successful",
        userId: data.user.id,
        userRole,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        redirectUrl,
        isNewUser,
        sessionToken: data.session?.access_token,
        performanceMetrics: {
          totalTimeMs: performance.now() - startTime,
          databaseTimeMs: databaseTime,
          tokenGenerationTimeMs: 0,
          userFetchTimeMs: 0,
        },
      }
    } catch (error) {
      console.error("Social auth callback error:", error)

      await this.recordLoginError({
        errorType: "auth/unexpected-error",
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
        method: `social/${provider}`,
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to complete authentication",
        error,
      }
    }
  }

  /**
   * Create user profile from social login
   */
  private async createUserProfileFromSocialLogin(
    user: any,
    provider: SocialProvider,
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { id, email, user_metadata } = user

      if (!email) {
        return { success: false, error: "Email is required" }
      }

      // Extract name from metadata
      const name = user_metadata?.name || user_metadata?.full_name || email.split("@")[0]
      const avatarUrl = user_metadata?.avatar_url || user_metadata?.picture

      // Create user in recruit.users table
      const { error: insertError } = await supabaseAdmin.from("recruit.users").insert({
        id,
        email,
        name,
        avatar_url: avatarUrl,
        social_provider: provider,
        points: 50, // Initial points
      })

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return { success: false, error: insertError }
      }

      // Set user type
      const { error: typeError } = await supabaseAdmin.from("user_types").insert({
        user_id: id,
        user_type: "recruit",
        email,
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
        return { success: false, error: typeError }
      }

      // Create social provider entry
      const { error: providerError } = await supabaseAdmin.from("user_social_providers").insert({
        user_id: id,
        provider,
        provider_id: user_metadata?.sub || user_metadata?.id || id,
        created_at: new Date().toISOString(),
      })

      if (providerError) {
        console.error("Error creating social provider entry:", providerError)
      }

      return { success: true }
    } catch (error) {
      console.error("Error creating user profile from social login:", error)
      return { success: false, error }
    }
  }

  /**
   * Register a new recruit user
   */
  async registerRecruit(email: string, password: string, name: string): Promise<AuthResult> {
    const startTime = performance.now()
    let databaseTime = 0

    try {
      // Check if email already exists
      const checkStart = performance.now()
      const { data: existingUser } = await supabaseAdmin
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle()
      databaseTime = performance.now() - checkStart

      if (existingUser) {
        return {
          success: false,
          message: "An account with this email already exists. Please sign in instead.",
        }
      }

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        await this.recordLoginError({
          email,
          errorType: "auth/signup-error",
          errorMessage: error.message,
          method: "password",
        })

        return {
          success: false,
          message: error.message,
          error,
        }
      }

      if (!data.user) {
        return {
          success: false,
          message: "Registration failed. Please try again.",
        }
      }

      // Use the admin client to insert into recruit.users table (bypassing RLS)
      const insertStart = performance.now()
      const { error: insertError } = await supabaseAdmin.from("recruit.users").insert({
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email?.split("@")[0] || "User",
        points: 50, // Initial points
      })
      databaseTime += performance.now() - insertStart

      if (insertError) {
        console.error("Error creating recruit user:", insertError)
        return {
          success: false,
          message: "User created but profile setup failed. Please contact support.",
          error: insertError,
        }
      }

      // Set user type using admin client
      const typeStart = performance.now()
      const { error: typeError } = await supabaseAdmin.from("user_types").insert({
        user_id: data.user.id,
        user_type: "recruit",
        email: data.user.email,
      })
      databaseTime += performance.now() - typeStart

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      // Log the initial points
      try {
        await supabaseAdmin.from("user_point_logs").insert([
          {
            user_id: data.user.id,
            points: 50,
            action: "Initial signup bonus",
            created_at: new Date().toISOString(),
          },
        ])
      } catch (logError) {
        console.error("Error logging initial points:", logError)
      }

      // Record successful registration
      await this.recordSuccessfulLogin({
        userId: data.user.id,
        email: data.user.email || "",
        method: "password",
        userRole: "recruit",
        isRegistration: true,
      })

      return {
        success: true,
        message: "Registration successful",
        userId: data.user.id,
        userRole: "recruit",
        email: data.user.email,
        name,
        redirectUrl: "/dashboard",
        isNewUser: true,
        performanceMetrics: {
          totalTimeMs: performance.now() - startTime,
          databaseTimeMs: databaseTime,
          tokenGenerationTimeMs: 0,
          userFetchTimeMs: 0,
        },
      }
    } catch (error) {
      console.error("Registration error:", error)

      await this.recordLoginError({
        email,
        errorType: "auth/unexpected-error",
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
        method: "password",
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
      }
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      // Get current user before signing out
      const { data: userData } = await supabase.auth.getUser()

      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        }
      }

      // Log the sign out if we had a user
      if (userData && userData.user) {
        const client = createClient()
        await client.from("login_audit_logs").insert({
          user_id: userData.user.id,
          event_type: "sign_out",
          details: { email: userData.user.email },
          created_at: new Date().toISOString(),
        })
      }

      return {
        success: true,
        message: "Signed out successfully",
        redirectUrl: "/",
      }
    } catch (error) {
      console.error("Sign out error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to sign out",
        error,
      }
    }
  }

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Get session error:", error)
        return null
      }

      return data.session
    } catch (error) {
      console.error("Get session error:", error)
      return null
    }
  }

  /**
   * Get redirect URL for user role
   */
  getRedirectUrlForUserRole(userRole: UserRole): string {
    switch (userRole) {
      case "recruit":
        return "/dashboard"
      case "volunteer":
        return "/volunteer-dashboard"
      case "admin":
        return "/admin/dashboard"
      default:
        return "/"
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Get user type
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", userId)
        .single()

      if (userTypeError || !userTypeData) {
        console.error("Error getting user type:", userTypeError)
        return null
      }

      const userRole = userTypeData.user_type as UserRole

      // Get linked social providers
      const { data: providerData } = await supabase
        .from("user_social_providers")
        .select("provider")
        .eq("user_id", userId)

      const providers = providerData?.map((item) => item.provider as SocialProvider) || []

      // Get user profile based on user role
      if (userRole === "recruit") {
        const { data: recruitData, error: recruitError } = await supabase
          .from("recruit.users")
          .select("*")
          .eq("id", userId)
          .single()

        if (recruitError || !recruitData) {
          console.error("Error getting recruit profile:", recruitError)
          return null
        }

        return {
          id: recruitData.id,
          email: recruitData.email,
          name: recruitData.name,
          userRole: "recruit",
          avatarUrl: recruitData.avatar_url,
          createdAt: recruitData.created_at,
          lastLoginAt: recruitData.last_login_at,
          loginCount: recruitData.login_count || 0,
          providers,
        }
      } else if (userRole === "volunteer") {
        const { data: volunteerData, error: volunteerError } = await supabase
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", userId)
          .single()

        if (volunteerError || !volunteerData) {
          console.error("Error getting volunteer profile:", volunteerError)
          return null
        }

        return {
          id: volunteerData.id,
          email: volunteerData.email,
          firstName: volunteerData.first_name,
          lastName: volunteerData.last_name,
          name: `${volunteerData.first_name} ${volunteerData.last_name}`,
          userRole: "volunteer",
          isActive: volunteerData.is_active,
          avatarUrl: volunteerData.avatar_url,
          createdAt: volunteerData.created_at,
          lastLoginAt: volunteerData.last_login_at,
          loginCount: volunteerData.login_count || 0,
          providers,
        }
      } else if (userRole === "admin") {
        const { data: adminData, error: adminError } = await supabase
          .from("admin.users")
          .select("*")
          .eq("id", userId)
          .single()

        if (adminError || !adminData) {
          // Fallback to auth user data
          const { data: userData } = await supabase.auth.getUser(userId)

          if (!userData.user) {
            console.error("Error getting admin profile:", adminError)
            return null
          }

          return {
            id: userData.user.id,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Admin",
            userRole: "admin",
            providers,
          }
        }

        return {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
          userRole: "admin",
          avatarUrl: adminData.avatar_url,
          createdAt: adminData.created_at,
          lastLoginAt: adminData.last_login_at,
          loginCount: adminData.login_count || 0,
          providers,
        }
      }

      return null
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  }

  /**
   * Update user's login statistics
   */
  private async updateLoginStatistics(userId: string, userRole: UserRole): Promise<void> {
    try {
      const now = new Date().toISOString()

      if (userRole === "recruit") {
        await supabaseAdmin
          .from("recruit.users")
          .update({
            last_login_at: now,
            login_count: supabaseAdmin.rpc("increment", {
              row_id: userId,
              table: "recruit.users",
              column: "login_count",
              amount: 1,
            }),
          })
          .eq("id", userId)
      } else if (userRole === "volunteer") {
        await supabaseAdmin
          .from("volunteer.recruiters")
          .update({
            last_login_at: now,
            login_count: supabaseAdmin.rpc("increment", {
              row_id: userId,
              table: "volunteer.recruiters",
              column: "login_count",
              amount: 1,
            }),
          })
          .eq("id", userId)
      } else if (userRole === "admin") {
        await supabaseAdmin
          .from("admin.users")
          .update({
            last_login_at: now,
            login_count: supabaseAdmin.rpc("increment", {
              row_id: userId,
              table: "admin.users",
              column: "login_count",
              amount: 1,
            }),
          })
          .eq("id", userId)
      }
    } catch (error) {
      console.error("Error updating login statistics:", error)
    }
  }

  /**
   * Log a login attempt
   */
  private async recordLoginAttempt(data: {
    userId?: string
    email?: string
    method: string
    userAgent?: string
    ipAddress?: string
  }): Promise<void> {
    try {
      const client = createClient()
      await client.from("login_audit_logs").insert({
        user_id: data.userId,
        event_type: "login_attempt",
        details: {
          email: data.email,
          method: data.method,
          user_agent: data.userAgent,
          ip_address: data.ipAddress,
        },
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error recording login attempt:", error)
    }
  }

  /**
   * Log a successful login
   */
  private async recordSuccessfulLogin(data: {
    userId: string
    email: string
    method: string
    userRole: UserRole
    isRegistration?: boolean
  }): Promise<void> {
    try {
      const client = createClient()
      await client.from("login_audit_logs").insert({
        user_id: data.userId,
        event_type: data.isRegistration ? "registration" : "login_success",
        details: {
          email: data.email,
          method: data.method,
          user_role: data.userRole,
          user_agent: this.getUserAgent(),
          ip_address: "client-side",
        },
        created_at: new Date().toISOString(),
      })

      // Record metrics
      await client.from("login_metrics").insert({
        user_role: data.userRole,
        login_method: data.method.split("/")[0] as LoginMethod,
        success: true,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error recording successful login:", error)
    }
  }

  /**
   * Log a login error
   */
  private async recordLoginError(data: {
    userId?: string
    email?: string
    errorType: string
    errorMessage: string
    method: string
  }): Promise<void> {
    try {
      const client = createClient()
      await client.from("login_errors").insert({
        user_id: data.userId,
        email: data.email,
        error_type: data.errorType,
        error_message: data.errorMessage,
        details: {
          method: data.method,
          user_agent: this.getUserAgent(),
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })

      // Record metrics
      const loginMethod = data.method.split("/")[0] as LoginMethod
      await client.from("login_metrics").insert({
        user_role: data.userId ? "unknown" : "anonymous",
        login_method: loginMethod,
        success: false,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error recording login error:", error)
    }
  }

  /**
   * Helper to get user agent
   */
  private getUserAgent(): string {
    if (typeof navigator !== "undefined") {
      return navigator.userAgent
    }
    return "server-side"
  }
}

export const enhancedAuthService = new EnhancedAuthService()
