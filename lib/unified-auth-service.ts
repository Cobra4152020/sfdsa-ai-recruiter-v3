import { supabase } from "@/lib/supabase-client-singleton"
import { supabaseAdmin } from "@/lib/supabase-service"
import { constructUrl } from "@/lib/url-utils"
import type { Provider } from "@supabase/supabase-js"

// User types
export type UserType = "recruit" | "volunteer" | "admin"

// Social provider type
export type SocialProvider = "google" | "facebook" | "twitter" | "github"

// Authentication result interface
export interface AuthResult {
  success: boolean
  message: string
  userId?: string
  userType?: UserType
  email?: string
  name?: string
  error?: any
  redirectUrl?: string
  isNewUser?: boolean
}

// User profile interface
export interface UserProfile {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  userType: UserType
  isActive?: boolean
  avatarUrl?: string
  createdAt?: string
  providers?: SocialProvider[]
}

/**
 * Unified Authentication Service
 * Handles all authentication operations for all user types
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
      // Authenticate with Supabase
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

      // Get user type and profile
      const userProfile = await this.getUserProfile(data.user.id)

      if (!userProfile) {
        return {
          success: false,
          message: "User profile not found. Please contact support.",
        }
      }

      // Determine redirect URL based on user type
      const redirectUrl = this.getRedirectUrlForUserType(userProfile.userType)

      // Check if volunteer is active
      if (userProfile.userType === "volunteer" && !userProfile.isActive) {
        return {
          success: true,
          message: "Your volunteer account is pending approval.",
          userId: data.user.id,
          userType: userProfile.userType,
          email: userProfile.email,
          name: userProfile.name,
          redirectUrl: "/volunteer-pending",
        }
      }

      return {
        success: true,
        message: "Login successful",
        userId: data.user.id,
        userType: userProfile.userType,
        email: userProfile.email,
        name: userProfile.name,
        redirectUrl,
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
   * Sign in with social provider
   */
  async signInWithSocialProvider(provider: Provider): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: constructUrl(`/auth/callback?provider=${provider}`),
        },
      })

      if (error) {
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
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to authenticate with provider",
        error,
      }
    }
  },

  /**
   * Handle social auth callback
   */
  async handleSocialAuthCallback(code: string, provider: string): Promise<AuthResult> {
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message || "Authentication failed",
          error,
        }
      }

      // Check if user exists in our system
      const { data: userTypeData } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle()

      let isNewUser = false
      let userType: UserType = "recruit" // Default to recruit for social logins

      if (!userTypeData) {
        isNewUser = true
        // Create new user profile for social login
        await this.createUserProfileFromSocialLogin(data.user, provider as SocialProvider)
      } else {
        userType = userTypeData.user_type as UserType
      }

      // Get redirect URL based on user type
      const redirectUrl = this.getRedirectUrlForUserType(userType)

      return {
        success: true,
        message: isNewUser ? "Account created successfully" : "Login successful",
        userId: data.user.id,
        userType,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        redirectUrl,
        isNewUser,
      }
    } catch (error) {
      console.error("Social auth callback error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to complete authentication",
        error,
      }
    }
  },

  /**
   * Create user profile from social login
   */
  async createUserProfileFromSocialLogin(
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
  },

  /**
   * Link social provider to existing account
   */
  async linkSocialProvider(userId: string, provider: SocialProvider, providerUserId: string): Promise<AuthResult> {
    try {
      // Check if this provider is already linked to another account
      const { data: existingLink } = await supabase
        .from("user_social_providers")
        .select("user_id")
        .eq("provider", provider)
        .eq("provider_id", providerUserId)
        .maybeSingle()

      if (existingLink && existingLink.user_id !== userId) {
        return {
          success: false,
          message: "This social account is already linked to another user",
        }
      }

      // Create or update the link
      const { error } = await supabase.from("user_social_providers").upsert(
        {
          user_id: userId,
          provider,
          provider_id: providerUserId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" },
      )

      if (error) {
        return {
          success: false,
          message: "Failed to link social account",
          error,
        }
      }

      return {
        success: true,
        message: `Successfully linked ${provider} account`,
        userId,
      }
    } catch (error) {
      console.error("Link social provider error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to link social account",
        error,
      }
    }
  },

  /**
   * Unlink social provider from account
   */
  async unlinkSocialProvider(userId: string, provider: SocialProvider): Promise<AuthResult> {
    try {
      // Check if user has password auth before unlinking
      const { data: userAuth } = await supabaseAdmin.auth.admin.getUserById(userId)

      if (!userAuth.user?.email) {
        return {
          success: false,
          message: "Cannot unlink the only authentication method",
        }
      }

      // Count linked providers
      const { data: providers, error: countError } = await supabase
        .from("user_social_providers")
        .select("provider")
        .eq("user_id", userId)

      if (countError) {
        return {
          success: false,
          message: "Failed to check linked providers",
          error: countError,
        }
      }

      // If this is the only provider and user has no password, prevent unlinking
      const hasPassword = await this.userHasPassword(userId)
      if (providers.length <= 1 && !hasPassword) {
        return {
          success: false,
          message: "You must set a password before unlinking your social account",
        }
      }

      // Delete the link
      const { error } = await supabase
        .from("user_social_providers")
        .delete()
        .eq("user_id", userId)
        .eq("provider", provider)

      if (error) {
        return {
          success: false,
          message: "Failed to unlink social account",
          error,
        }
      }

      return {
        success: true,
        message: `Successfully unlinked ${provider} account`,
        userId,
      }
    } catch (error) {
      console.error("Unlink social provider error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to unlink social account",
        error,
      }
    }
  },

  /**
   * Check if user has password authentication
   */
  async userHasPassword(userId: string): Promise<boolean> {
    try {
      // This is a simplified check - in a real implementation,
      // you would need to use the Supabase admin API to check if the user has a password
      const { data } = await supabaseAdmin.auth.admin.getUserById(userId)

      // Check if the user has identities with password
      const hasPassword = data.user?.identities?.some(
        (identity) => identity.provider === "email" && identity.identity_data?.email,
      )

      return !!hasPassword
    } catch (error) {
      console.error("Check user password error:", error)
      return false
    }
  },

  /**
   * Get linked social providers for a user
   */
  async getLinkedSocialProviders(userId: string): Promise<SocialProvider[]> {
    try {
      const { data, error } = await supabase.from("user_social_providers").select("provider").eq("user_id", userId)

      if (error) {
        console.error("Get linked providers error:", error)
        return []
      }

      return data.map((item) => item.provider as SocialProvider)
    } catch (error) {
      console.error("Get linked providers error:", error)
      return []
    }
  },

  /**
   * Sign in with magic link (passwordless)
   */
  async signInWithMagicLink(email: string, redirectUrl?: string): Promise<AuthResult> {
    try {
      // Check if user exists and get user type
      const { data: userData } = await supabaseAdmin
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle()

      // Determine appropriate redirect URL
      let finalRedirectUrl = redirectUrl
      if (!finalRedirectUrl && userData) {
        finalRedirectUrl = this.getRedirectUrlForUserType(userData.user_type as UserType)
      }

      // Default to recruit dashboard if no redirect specified
      finalRedirectUrl = finalRedirectUrl || constructUrl("/dashboard")

      // Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: finalRedirectUrl,
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
        message: "Magic link sent successfully. Please check your email.",
        email,
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
   * Register a new recruit user
   */
  async registerRecruit(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabaseAdmin
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle()

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
      const { error: insertError } = await supabaseAdmin.from("recruit.users").insert({
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email?.split("@")[0] || "User",
        points: 50, // Initial points
      })

      if (insertError) {
        console.error("Error creating recruit user:", insertError)
        return {
          success: false,
          message: "User created but profile setup failed. Please contact support.",
          error: insertError,
        }
      }

      // Set user type using admin client
      const { error: typeError } = await supabaseAdmin.from("user_types").insert({
        user_id: data.user.id,
        user_type: "recruit",
        email: data.user.email,
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      return {
        success: true,
        message: "Registration successful",
        userId: data.user.id,
        userType: "recruit",
        email: data.user.email,
        name,
        redirectUrl: "/dashboard",
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
      }
    }
  },

  /**
   * Register a new volunteer recruiter
   */
  async registerVolunteerRecruiter(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    organization: string,
    position: string,
    location: string,
  ): Promise<AuthResult> {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabaseAdmin
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle()

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
            first_name: firstName,
            last_name: lastName,
            phone,
            organization,
            position,
            location,
          },
        },
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
          message: "Registration failed. Please try again.",
        }
      }

      // Use the admin client to insert into volunteer.recruiters table (bypassing RLS)
      const { error: insertError } = await supabaseAdmin.from("volunteer.recruiters").insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        phone,
        organization,
        position,
        location,
        is_active: false, // Requires verification
      })

      if (insertError) {
        console.error("Error creating volunteer recruiter:", insertError)
        return {
          success: false,
          message: "User created but profile setup failed. Please contact support.",
          error: insertError,
        }
      }

      // Set user type using admin client
      const { error: typeError } = await supabaseAdmin.from("user_types").insert({
        user_id: data.user.id,
        user_type: "volunteer",
        email: data.user.email,
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      return {
        success: true,
        message: "Registration successful. Your account requires verification.",
        userId: data.user.id,
        userType: "volunteer",
        email: data.user.email,
        name: `${firstName} ${lastName}`,
        redirectUrl: "/volunteer-pending",
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        error,
      }
    }
  },

  /**
   * Sign out the current user
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
  },

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
  },

  /**
   * Get the current user with profile information
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        return null
      }

      return await this.getUserProfile(data.user.id)
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  },

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

      const userType = userTypeData.user_type as UserType

      // Get linked social providers
      const providers = await this.getLinkedSocialProviders(userId)

      // Get user profile based on user type
      if (userType === "recruit") {
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
          userType: "recruit",
          avatarUrl: recruitData.avatar_url,
          createdAt: recruitData.created_at,
          providers,
        }
      } else if (userType === "volunteer") {
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
          userType: "volunteer",
          isActive: volunteerData.is_active,
          avatarUrl: volunteerData.avatar_url,
          createdAt: volunteerData.created_at,
          providers,
        }
      } else if (userType === "admin") {
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
            userType: "admin",
            providers,
          }
        }

        return {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
          userType: "admin",
          avatarUrl: adminData.avatar_url,
          createdAt: adminData.created_at,
          providers,
        }
      }

      return null
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: constructUrl("/reset-password"),
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
        message: "Password reset instructions sent to your email",
        email,
      }
    } catch (error) {
      console.error("Reset password error:", error)
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
   * Update user profile
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<AuthResult> {
    try {
      // Get user type
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", userId)
        .single()

      if (userTypeError || !userTypeData) {
        return {
          success: false,
          message: "User type not found",
          error: userTypeError,
        }
      }

      const userType = userTypeData.user_type as UserType

      // Update profile based on user type
      if (userType === "recruit") {
        const { error: updateError } = await supabase
          .from("recruit.users")
          .update({
            name: profileData.name,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: updateError,
          }
        }
      } else if (userType === "volunteer") {
        const { error: updateError } = await supabase
          .from("volunteer.recruiters")
          .update({
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: updateError,
          }
        }
      } else if (userType === "admin") {
        const { error: updateError } = await supabase
          .from("admin.users")
          .update({
            name: profileData.name,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: updateError,
          }
        }
      }

      // Update auth metadata
      const updateData: Record<string, any> = {}

      if (userType === "recruit" && profileData.name) {
        updateData.name = profileData.name
      } else if (userType === "volunteer") {
        if (profileData.firstName) updateData.first_name = profileData.firstName
        if (profileData.lastName) updateData.last_name = profileData.lastName
      } else if (userType === "admin" && profileData.name) {
        updateData.name = profileData.name
      }

      if (Object.keys(updateData).length > 0) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: updateData,
        })

        if (metadataError) {
          console.error("Error updating auth metadata:", metadataError)
        }
      }

      return {
        success: true,
        message: "Profile updated successfully",
      }
    } catch (error) {
      console.error("Update profile error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update profile",
        error,
      }
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session
  },

  /**
   * Check if user has a specific role
   */
  async hasRole(userId: string, role: UserType): Promise<boolean> {
    try {
      const { data } = await supabase.from("user_types").select("user_type").eq("user_id", userId).single()

      return data?.user_type === role
    } catch (error) {
      console.error(`Error checking if user has role ${role}:`, error)
      return false
    }
  },

  /**
   * Get redirect URL for user type
   */
  getRedirectUrlForUserType(userType: UserType): string {
    switch (userType) {
      case "recruit":
        return "/dashboard"
      case "volunteer":
        return "/volunteer-dashboard"
      case "admin":
        return "/admin/dashboard"
      default:
        return "/"
    }
  },

  /**
   * Create admin user (admin only)
   */
  async createAdminUser(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      // This should only be callable by existing admins
      const currentUser = await this.getCurrentUser()

      if (!currentUser || currentUser.userType !== "admin") {
        return {
          success: false,
          message: "Unauthorized. Only admins can create admin users.",
        }
      }

      // Create user in Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
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
          message: "Failed to create admin user",
        }
      }

      // Create admin user in database
      const { error: insertError } = await supabaseAdmin.from("admin.users").insert({
        id: data.user.id,
        email: data.user.email,
        name,
      })

      if (insertError) {
        console.error("Error creating admin user:", insertError)
        return {
          success: false,
          message: "User created but profile setup failed",
          error: insertError,
        }
      }

      // Set user type
      const { error: typeError } = await supabaseAdmin.from("user_types").insert({
        user_id: data.user.id,
        user_type: "admin",
        email: data.user.email,
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      return {
        success: true,
        message: "Admin user created successfully",
        userId: data.user.id,
        userType: "admin",
        email: data.user.email,
        name,
      }
    } catch (error) {
      console.error("Create admin user error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create admin user",
        error,
      }
    }
  },
}
