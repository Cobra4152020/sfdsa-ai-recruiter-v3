import { supabase } from "@/lib/supabase-client-singleton"
import { supabaseAdmin } from "@/lib/supabase-service"

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
   * Register a new recruit user
   */
  async registerRecruit(email: string, password: string, name: string): Promise<AuthResult> {
    try {
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
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      return {
        success: true,
        message: "Registration successful",
        userId: data.user.id,
        userType: "recruit",
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
      })

      if (typeError) {
        console.error("Error setting user type:", typeError)
      }

      return {
        success: true,
        message: "Registration successful. Your account requires verification.",
        userId: data.user.id,
        userType: "volunteer",
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
   * Get current session with user type
   */
  async getSessionWithUserType() {
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
    try {
      const { data } = await supabase.from("user_types").select("user_type").eq("user_id", userId).single()

      return data?.user_type === "volunteer"
    } catch (error) {
      console.error("Error checking if user is volunteer recruiter:", error)
      return false
    }
  },
}
