import type { Provider } from "@supabase/supabase-js";
import type {
  AuthResult,
  UserProfile,
  // SocialProvider, // Commented out unused import
} from "./unified-auth-service";
import { getClientSideSupabase } from "@/lib/supabase";

export const authService = {
  async signInWithSocialProvider(provider: Provider): Promise<AuthResult> {
    try {
      const supabase = getClientSideSupabase();
      const { data, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        };
      }
      return {
        success: true,
        message: "Redirecting to provider...",
        redirectUrl: data?.url,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error,
      };
    }
  },
  async signOut(): Promise<AuthResult> {
    try {
      const supabase = getClientSideSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return {
          success: false,
          message: error.message,
          error,
        };
      }
      return {
        success: true,
        message: "Signed out successfully",
        redirectUrl: "/",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to sign out",
        error,
      };
    }
  },
  async getSession() {
    try {
      const supabase = getClientSideSupabase();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return null;
      }
      return data.session;
    } catch (_error) {
      return null;
    }
  },
  // All other methods throw if called on the client
  async signInWithPassword() {
    throw new Error("signInWithPassword is only available on the server.");
  },
  async handleSocialAuthCallback() {
    throw new Error(
      "handleSocialAuthCallback is only available on the server.",
    );
  },
  async registerRecruit() {
    throw new Error("registerRecruit is only available on the server.");
  },
  async getCurrentUser(): Promise<UserProfile | null> {
    throw new Error("getCurrentUser is only available on the server.");
  },
  async getUserProfile() {
    throw new Error("getUserProfile is only available on the server.");
  },
  async resetPassword() {
    throw new Error("resetPassword is only available on the server.");
  },
  async updatePassword() {
    throw new Error("updatePassword is only available on the server.");
  },
  async isAuthenticated() {
    throw new Error("isAuthenticated is only available on the server.");
  },
  async hasRole() {
    throw new Error("hasRole is only available on the server.");
  },
  getRedirectUrlForUserType() {
    throw new Error(
      "getRedirectUrlForUserType is only available on the server.",
    );
  },
  async createAdminUser() {
    throw new Error("createAdminUser is only available on the server.");
  },
};
