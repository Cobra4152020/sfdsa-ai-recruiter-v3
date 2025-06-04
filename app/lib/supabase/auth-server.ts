import { getServiceSupabase } from "@/app/lib/supabase/server";
import { createClient } from "@/lib/supabase";
import type { AuthResult } from "@/lib/auth-service";

/**
 * Register a new recruit user (server-only)
 */
export async function registerRecruit(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }

    // Use the admin client to insert into recruit.users table (bypassing RLS)
    const { error: insertError } = await getServiceSupabase()
      .from("recruit.users")
      .insert({
        id: data.user.id,
        email: data.user.email,
        name: name || data.user.email?.split("@")[0] || "User",
        points: 50, // Initial points
      });

    if (insertError) {
      console.error("Error creating recruit user:", insertError);
      return {
        success: false,
        message:
          "User created but profile setup failed. Please contact support.",
        error: insertError,
      };
    }

    // Set user type using admin client
    const { error: typeError } = await getServiceSupabase()
      .from("user_types")
      .insert({
        user_id: data.user.id,
        user_type: "recruit",
      });

    if (typeError) {
      console.error("Error setting user type:", typeError);
    }

    return {
      success: true,
      message: "Registration successful",
      userId: data.user.id,
      userType: "recruit",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      error,
    };
  }
}

/**
 * Register a new volunteer recruiter (server-only)
 */
export async function registerVolunteerRecruiter(
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
    const supabase = createClient();

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
    });

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }

    // Use the admin client to insert into volunteer.recruiters table (bypassing RLS)
    const { error: insertError } = await getServiceSupabase()
      .from("volunteer.recruiters")
      .insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        phone,
        organization,
        position,
        location,
        is_active: false, // Requires verification
      });

    if (insertError) {
      console.error("Error creating volunteer recruiter:", insertError);
      return {
        success: false,
        message:
          "User created but profile setup failed. Please contact support.",
        error: insertError,
      };
    }

    // Set user type using admin client
    const { error: typeError } = await getServiceSupabase()
      .from("user_types")
      .insert({
        user_id: data.user.id,
        user_type: "volunteer",
      });

    if (typeError) {
      console.error("Error setting user type:", typeError);
    }

    return {
      success: true,
      message: "Registration successful. Your account requires verification.",
      userId: data.user.id,
      userType: "volunteer",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      error,
    };
  }
}
