import { getClientSideSupabase } from "@/lib/supabase";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { constructUrl } from "@/lib/url-utils";
import type {
  Provider,
  PostgrestError,
  User,
  SupabaseClient,
} from "@supabase/supabase-js";
import { AuthError as SupabaseAuthError } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase-types";

// User types
export type UserType = "recruit" | "volunteer" | "admin";

// Social provider type
export type SocialProvider = "google" | "facebook" | "twitter" | "github";

// Custom error types
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Type guard for custom errors
function isCustomError(error: unknown): error is AuthError | DatabaseError {
  return (
    error instanceof Error &&
    (error.name === "AuthError" || error.name === "DatabaseError")
  );
}

// Type guard for PostgrestError
function isPostgrestError(error: unknown): error is PostgrestError {
  return error instanceof Error && "code" in error && "message" in error;
}

// Type guard for SupabaseAuthError
function isSupabaseAuthError(error: unknown): error is SupabaseAuthError {
  return error instanceof Error && error.name === "AuthError";
}

// Type for Supabase client with proper database schema
type SupabaseClientType = SupabaseClient<Database>;

// Helper function to get typed Supabase client
function getTypedSupabase(): SupabaseClient<Database> {
  return getClientSideSupabase() as SupabaseClient<Database>;
}

// Helper function to get typed service Supabase client
function getTypedServiceSupabase(): SupabaseClient<Database> {
  return getServiceSupabase() as SupabaseClient<Database>;
}

// Type for user identity
interface UserIdentity {
  provider: string;
  identity_data?: {
    email?: string;
  };
}

// Helper function to convert PostgrestError to DatabaseError
function handlePostgrestError(error: PostgrestError): DatabaseError {
  return new DatabaseError(error.message, error.code);
}

// Helper function to convert unknown errors to our error types
function handleError(error: unknown): AuthError | DatabaseError {
  if (isCustomError(error)) {
    return error;
  }
  if (isPostgrestError(error)) {
    return handlePostgrestError(error);
  }
  if (isSupabaseAuthError(error)) {
    return new AuthError(error.message, error.status?.toString());
  }
  return new DatabaseError(
    error instanceof Error ? error.message : String(error),
  );
}

// Helper function to get typed table (accepts string for dynamic table names)
function getTypedTable(supabase: SupabaseClient<Database>, table: string) {
  return supabase.from(table);
}

// User type for social login
interface SocialUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
}

// Authentication result interface
export interface AuthResult {
  success: boolean;
  message: string;
  userId?: string;
  userType?: UserType;
  email?: string;
  name?: string;
  error?: AuthError | DatabaseError;
  redirectUrl?: string;
  isNewUser?: boolean;
}

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
  providers?: SocialProvider[];
}

// Type for user registration data
export interface UserRegistrationData {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  position?: string;
  location?: string;
}

// Type for profile update data
export interface ProfileUpdateData {
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

// Helper function to handle database operations
async function handleDatabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
): Promise<{ data: T | null; error: AuthError | DatabaseError | null }> {
  try {
    const result = await operation();
    if (result.error) {
      return { data: null, error: handleError(result.error) };
    }
    return { data: result.data, error: null };
  } catch (error) {
    return { data: null, error: handleError(error) };
  }
}

/**
 * Unified Authentication Service
 * Handles all authentication operations for all user types
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(
    email: string,
    password: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: "Authentication failed. Please try again.",
          error: new AuthError("No user data returned from authentication"),
        };
      }

      // Get user type and profile
      const userProfile = await this.getUserProfile(data.user.id);

      if (!userProfile) {
        return {
          success: false,
          message: "User profile not found. Please contact support.",
          error: new AuthError("User profile not found"),
        };
      }

      // Determine redirect URL based on user type
      const redirectUrl = this.getRedirectUrlForUserType(userProfile.userType);

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
        };
      }

      return {
        success: true,
        message: "Login successful",
        userId: data.user.id,
        userType: userProfile.userType,
        email: userProfile.email,
        name: userProfile.name,
        redirectUrl,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        error: handleError(error),
      };
    }
  },

  /**
   * Sign in with social provider
   */
  async signInWithSocialProvider(provider: Provider): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: constructUrl(`/auth/callback?provider=${provider}`),
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      if (!data.url) {
        return {
          success: false,
          message: "Failed to generate authentication URL",
          error: new AuthError("No authentication URL returned"),
        };
      }

      // Return success with the URL to redirect to
      return {
        success: true,
        message: "Redirecting to provider...",
        redirectUrl: data.url,
      };
    } catch (error) {
      console.error("Social sign in error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to authenticate with provider",
        error: handleError(error),
      };
    }
  },

  /**
   * Handle social auth callback
   */
  async handleSocialAuthCallback(
    code: string,
    provider: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message || "Authentication failed",
          error: error
            ? handleError(error)
            : new AuthError("No user data returned"),
        };
      }

      // Check if user exists in our system
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (userTypeError) {
        return {
          success: false,
          message: "Failed to check user type",
          error: handlePostgrestError(userTypeError),
        };
      }

      let isNewUser = false;
      let userType: UserType = "recruit"; // Default to recruit for social logins

      if (!userTypeData) {
        isNewUser = true;
        // Create new user profile for social login
        const createResult = await this.createUserProfileFromSocialLogin(
          {
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          },
          provider as SocialProvider,
        );

        if (!createResult.success) {
          return {
            success: false,
            message: "Failed to create user profile",
            error: createResult.error,
          };
        }

        userType = createResult.userType || "recruit";
      } else {
        userType = userTypeData.user_type as UserType;
      }

      // Get user profile
      const userProfile = await this.getUserProfile(data.user.id);

      if (!userProfile) {
        return {
          success: false,
          message: "Failed to get user profile",
          error: new AuthError("User profile not found"),
        };
      }

      // Determine redirect URL based on user type
      const redirectUrl = this.getRedirectUrlForUserType(userType);

      return {
        success: true,
        message: isNewUser
          ? "Account created successfully"
          : "Login successful",
        userId: data.user.id,
        userType,
        email: userProfile.email,
        name: userProfile.name,
        redirectUrl,
        isNewUser,
      };
    } catch (error) {
      console.error("Social auth callback error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete social authentication",
        error: handleError(error),
      };
    }
  },

  /**
   * Create user profile from social login
   */
  async createUserProfileFromSocialLogin(
    user: SocialUser,
    provider: SocialProvider,
  ): Promise<{
    success: boolean;
    error?: AuthError | DatabaseError;
    userType?: UserType;
  }> {
    try {
      if (!user.email) {
        throw new AuthError("Email is required");
      }

      const supabase = getTypedServiceSupabase();

      // Create user type entry
      const { error: userTypeError } = await supabase
        .from("user_types")
        .insert({
          user_id: user.id,
          user_type: "recruit",
        });

      if (userTypeError) {
        throw handlePostgrestError(userTypeError);
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from("recruit.users")
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          avatar_url: user.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        throw handlePostgrestError(profileError);
      }

      return { success: true };
    } catch (error) {
      console.error("Error creating user profile from social login:", error);
      return {
        success: false,
        error: handleError(error),
      };
    }
  },

  /**
   * Link social provider to existing account
   */
  async linkSocialProvider(
    userId: string,
    provider: SocialProvider,
    providerUserId: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();
      const table = getTypedTable(supabase, "user_social_providers");
      const { data: existingLink, error: linkError } = await table
        .select("user_id")
        .eq("provider", provider)
        .eq("provider_id", providerUserId)
        .maybeSingle();
      if (linkError) {
        return {
          success: false,
          message: "Failed to check existing provider link",
          error: handleError(linkError),
        };
      }
      if (existingLink && existingLink.user_id !== userId) {
        return {
          success: false,
          message: "This social account is already linked to another user",
          error: new AuthError("Provider already linked to another user"),
        };
      }
      const { error } = await table.upsert(
        {
          user_id: userId,
          provider,
          provider_id: providerUserId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" },
      );
      if (error) {
        return {
          success: false,
          message: "Failed to link social account",
          error: handleError(error),
        };
      }
      return {
        success: true,
        message: `Successfully linked ${provider} account`,
        userId,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to link social account",
        error: handleError(error),
      };
    }
  },

  /**
   * Unlink social provider from account
   */
  async unlinkSocialProvider(
    userId: string,
    provider: SocialProvider,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();
      const serviceSupabase = getTypedServiceSupabase();
      const table = getTypedTable(supabase, "user_social_providers");
      const { data: userAuth } =
        await serviceSupabase.auth.admin.getUserById(userId);
      if (!userAuth.user?.email) {
        return {
          success: false,
          message: "Cannot unlink the only authentication method",
          error: new AuthError("No email authentication available"),
        };
      }
      const { data: providers, error: countError } = await table
        .select("provider")
        .eq("user_id", userId);
      if (countError) {
        return {
          success: false,
          message: "Failed to check linked providers",
          error: handleError(countError),
        };
      }
      const hasPassword = await this.userHasPassword(userId);
      if (providers.length <= 1 && !hasPassword) {
        return {
          success: false,
          message:
            "You must set a password before unlinking your social account",
          error: new AuthError(
            "No alternative authentication method available",
          ),
        };
      }
      const { error } = await table
        .delete()
        .eq("user_id", userId)
        .eq("provider", provider);
      if (error) {
        return {
          success: false,
          message: "Failed to unlink social account",
          error: handleError(error),
        };
      }
      return {
        success: true,
        message: `Successfully unlinked ${provider} account`,
        userId,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to unlink social account",
        error: handleError(error),
      };
    }
  },

  /**
   * Check if user has password authentication
   */
  async userHasPassword(userId: string): Promise<boolean> {
    try {
      const serviceSupabase = getTypedServiceSupabase();

      // This is a simplified check - in a real implementation,
      // you would need to use the Supabase admin API to check if the user has a password
      const { data } = await serviceSupabase.auth.admin.getUserById(userId);

      // Check if the user has identities with password
      const hasPassword = data.user?.identities?.some(
        (identity: UserIdentity) =>
          identity.provider === "email" && identity.identity_data?.email,
      );

      return !!hasPassword;
    } catch (error) {
      console.error("Check user password error:", error);
      return false;
    }
  },

  /**
   * Get linked social providers for a user
   */
  async getLinkedSocialProviders(userId: string): Promise<SocialProvider[]> {
    try {
      const supabase = getTypedSupabase();
      const { data, error } = await supabase
        .from("user_social_providers")
        .select("provider")
        .eq("user_id", userId);

      if (error) {
        console.error("Get linked providers error:", error);
        return [];
      }

      return data.map((item) => item.provider as SocialProvider);
    } catch (error) {
      console.error("Get linked providers error:", error);
      return [];
    }
  },

  /**
   * Sign in with magic link (passwordless)
   */
  async signInWithMagicLink(
    email: string,
    redirectUrl?: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // Check if user exists and get user type
      const { data: userData } = await getTypedServiceSupabase()
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle();

      // Determine appropriate redirect URL
      let finalRedirectUrl = redirectUrl;
      if (!finalRedirectUrl && userData) {
        finalRedirectUrl = this.getRedirectUrlForUserType(
          userData.user_type as UserType,
        );
      }

      // Default to recruit dashboard if no redirect specified
      finalRedirectUrl = finalRedirectUrl || constructUrl("/dashboard");

      // Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: finalRedirectUrl,
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      return {
        success: true,
        message: "Magic link sent successfully. Please check your email.",
        email,
      };
    } catch (error) {
      console.error("Magic link error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send magic link",
        error: handleError(error),
      };
    }
  },

  /**
   * Register a new recruit user
   */
  async registerRecruit(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // Check if email already exists
      const { data: existingUser } = await getTypedServiceSupabase()
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return {
          success: false,
          message:
            "An account with this email already exists. Please sign in instead.",
        };
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
      const { error: insertError } = await getTypedServiceSupabase()
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
          error: handleError(insertError),
        };
      }

      // Set user type using admin client
      const { error: typeError } = await getTypedServiceSupabase()
        .from("user_types")
        .insert({
          user_id: data.user.id,
          user_type: "recruit",
          email: data.user.email,
        });

      if (typeError) {
        console.error("Error setting user type:", typeError);
      }

      return {
        success: true,
        message: "Registration successful",
        userId: data.user.id,
        userType: "recruit",
        email: data.user.email,
        name,
        redirectUrl: "/dashboard",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        error: handleError(error),
      };
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
      const supabase = getTypedSupabase();

      // Check if email already exists
      const { data: existingUser } = await getTypedServiceSupabase()
        .from("user_types")
        .select("user_id, user_type")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return {
          success: false,
          message:
            "An account with this email already exists. Please sign in instead.",
        };
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
      const { error: insertError } = await getTypedServiceSupabase()
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
          error: handleError(insertError),
        };
      }

      // Set user type using admin client
      const { error: typeError } = await getTypedServiceSupabase()
        .from("user_types")
        .insert({
          user_id: data.user.id,
          user_type: "volunteer",
          email: data.user.email,
        });

      if (typeError) {
        console.error("Error setting user type:", typeError);
      }

      return {
        success: true,
        message: "Registration successful. Your account requires verification.",
        userId: data.user.id,
        userType: "volunteer",
        email: data.user.email,
        name: `${firstName} ${lastName}`,
        redirectUrl: "/volunteer-pending",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        error,
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      return {
        success: true,
        message: "Signed out successfully",
        redirectUrl: "/",
      };
    } catch (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to sign out",
        error: handleError(error),
      };
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const supabase = getTypedSupabase();

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Get session error:", error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  },

  /**
   * Get the current user with profile information
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const supabase = getTypedSupabase();

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return null;
      }

      return await this.getUserProfile(data.user.id);
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = getTypedSupabase();

      // Get user type
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", userId)
        .single();

      if (userTypeError || !userTypeData) {
        console.error("Error getting user type:", userTypeError);
        return null;
      }

      const userType = userTypeData.user_type as UserType;

      // Get linked social providers
      const providers = await this.getLinkedSocialProviders(userId);

      // Get user profile based on user type
      if (userType === "recruit") {
        const { data: recruitData, error: recruitError } = await supabase
          .from("recruit.users")
          .select("*")
          .eq("id", userId)
          .single();

        if (recruitError || !recruitData) {
          console.error("Error getting recruit profile:", recruitError);
          return null;
        }

        return {
          id: recruitData.id,
          email: recruitData.email,
          name: recruitData.name,
          userType: "recruit",
          avatarUrl: recruitData.avatar_url,
          createdAt: recruitData.created_at,
          providers,
        };
      } else if (userType === "volunteer") {
        const { data: volunteerData, error: volunteerError } = await supabase
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", userId)
          .single();

        if (volunteerError || !volunteerData) {
          console.error("Error getting volunteer profile:", volunteerError);
          return null;
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
        };
      } else if (userType === "admin") {
        const { data: adminData, error: adminError } = await supabase
          .from("admin.users")
          .select("*")
          .eq("id", userId)
          .single();

        if (adminError || !adminData) {
          // Fallback to auth user data
          const { data: userData } = await supabase.auth.getUser(userId);

          if (!userData.user) {
            console.error("Error getting admin profile:", adminError);
            return null;
          }

          return {
            id: userData.user.id,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Admin",
            userType: "admin",
            providers,
          };
        }

        return {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
          userType: "admin",
          avatarUrl: adminData.avatar_url,
          createdAt: adminData.created_at,
          providers,
        };
      }

      return null;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: constructUrl("/reset-password"),
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      return {
        success: true,
        message: "Password reset instructions sent to your email",
        email,
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send password reset email",
        error: handleError(error),
      };
    }
  },

  /**
   * Update password
   */
  async updatePassword(password: string): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }

      return {
        success: true,
        message: "Password updated successfully",
      };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update password",
        error: handleError(error),
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    profileData: Partial<UserProfile>,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // Get user type
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", userId)
        .single();

      if (userTypeError || !userTypeData) {
        return {
          success: false,
          message: "User type not found",
          error: userTypeError ? handleError(userTypeError) : undefined,
        };
      }

      const userType = userTypeData.user_type as UserType;

      // Update profile based on user type
      if (userType === "recruit") {
        const { error: updateError } = await supabase
          .from("recruit.users")
          .update({
            name: profileData.name,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: handleError(updateError),
          };
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
          .eq("id", userId);

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: handleError(updateError),
          };
        }
      } else if (userType === "admin") {
        const { error: updateError } = await supabase
          .from("admin.users")
          .update({
            name: profileData.name,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          return {
            success: false,
            message: "Failed to update profile",
            error: handleError(updateError),
          };
        }
      }

      // Update auth metadata
      const updateData: Record<string, string | number | boolean | undefined> =
        {};

      if (userType === "recruit" && profileData.name) {
        updateData.name = profileData.name;
      } else if (userType === "volunteer") {
        if (profileData.firstName)
          updateData.first_name = profileData.firstName;
        if (profileData.lastName) updateData.last_name = profileData.lastName;
      } else if (userType === "admin" && profileData.name) {
        updateData.name = profileData.name;
      }

      if (Object.keys(updateData).length > 0) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: updateData,
        });

        if (metadataError) {
          console.error("Error updating auth metadata:", metadataError);
        }
      }

      return {
        success: true,
        message: "Profile updated successfully",
      };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        error: handleError(error),
      };
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const supabase = getTypedSupabase();

      const session = await this.getSession();
      return !!session;
    } catch (error) {
      console.error("Get session error:", error);
      return false;
    }
  },

  /**
   * Check if user has a specific role
   */
  async hasRole(userId: string, role: UserType): Promise<boolean> {
    try {
      const supabase = getTypedSupabase();

      const { data } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", userId)
        .single();

      return data?.user_type === role;
    } catch (error) {
      console.error(`Error checking if user has role ${role}:`, error);
      return false;
    }
  },

  /**
   * Get redirect URL for user type
   */
  getRedirectUrlForUserType(userType: UserType): string {
    switch (userType) {
      case "recruit":
        return "/dashboard";
      case "volunteer":
        return "/volunteer-dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  },

  /**
   * Create admin user (admin only)
   */
  async createAdminUser(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();

      // This should only be callable by existing admins
      const currentUser = await this.getCurrentUser();

      if (!currentUser || currentUser.userType !== "admin") {
        return {
          success: false,
          message: "Unauthorized. Only admins can create admin users.",
        };
      }

      // Create user in Supabase Auth
      const { data, error } =
        await getTypedServiceSupabase().auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name },
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
          message: "Failed to create admin user",
        };
      }

      // Create admin user in database
      const { error: insertError } = await getTypedServiceSupabase()
        .from("admin.users")
        .insert({
          id: data.user.id,
          email: data.user.email,
          name,
        });

      if (insertError) {
        console.error("Error creating admin user:", insertError);
        return {
          success: false,
          message: "User created but profile setup failed",
          error: handleError(insertError),
        };
      }

      // Set user type
      const { error: typeError } = await getTypedServiceSupabase()
        .from("user_types")
        .insert({
          user_id: data.user.id,
          user_type: "admin",
          email: data.user.email,
        });

      if (typeError) {
        console.error("Error setting user type:", typeError);
      }

      return {
        success: true,
        message: "Admin user created successfully",
        userId: data.user.id,
        userType: "admin",
        email: data.user.email,
        name,
      };
    } catch (error) {
      console.error("Create admin user error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create admin user",
        error: handleError(error),
      };
    }
  },

  async handleSocialAuth(provider: Provider): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: constructUrl("/auth/callback"),
        },
      });
      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }
      if (!data.url) {
        return {
          success: false,
          message: "No redirect URL provided",
          error: new AuthError("No redirect URL provided"),
        };
      }
      return {
        success: true,
        message: "Redirecting to social login...",
        redirectUrl: data.url,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to initiate social login",
        error: handleError(error),
      };
    }
  },

  async handleSocialCallback(): Promise<AuthResult> {
    try {
      const supabase = getTypedSupabase();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return {
          success: false,
          message: error.message,
          error: handleError(error),
        };
      }
      if (!data.session?.user) {
        return {
          success: false,
          message: "No user session found",
          error: new AuthError("No user session found"),
        };
      }
      const { user } = data.session;
      const provider = user.app_metadata.provider as SocialProvider;
      const table = getTypedTable(supabase, "user_social_providers");
      const { data: userTypeData, error: userTypeError } = await table
        .select("user_type")
        .eq("user_id", user.id)
        .single();
      if (userTypeError) {
        return {
          success: false,
          message: "Failed to check user type",
          error: handleError(userTypeError),
        };
      }
      let userType: UserType = "recruit";
      let isNewUser = false;
      if (!userTypeData) {
        isNewUser = true;
        const createResult = await this.createUserProfileFromSocialLogin(
          {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          },
          provider,
        );
        if (!createResult.success) {
          return {
            success: false,
            message: "Failed to create user profile",
            error: createResult.error,
          };
        }
        userType = createResult.userType || "recruit";
      } else {
        userType = userTypeData.user_type as UserType;
      }
      return {
        success: true,
        message: "Successfully authenticated",
        userId: user.id,
        userType,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        isNewUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete social login",
        error: handleError(error),
      };
    }
  },
};
