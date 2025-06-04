// import { constructUrl } from "./url-utils"; // Commented out unused import

// Environment checks
// const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_BUILD === "true"; // Commented out unused variable
// const DISABLE_DATABASE_CHECKS = // Commented out unused variable
//   process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS === "true";

// Hardcoded production URL to ensure consistency
const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || "https://www.sfdeputysheriff.com";

// User types
export type UserType = "recruit" | "volunteer" | "admin";

// Auth config type
interface AuthConfig {
  redirectUrls: {
    base: string;
    login: string;
    resetPassword: string;
    emailVerification: string;
    signUp: string;
    volunteerSignUp: string;
    volunteerConfirm: string;
    callback: string;
  };
  userTypePaths: Record<UserType, string>;
  storage: {
    storageKey: string;
    storage: Storage | undefined;
  };
  schemas: {
    public: string;
    recruit: string;
    volunteer: string;
    admin: string;
  };
  clientConfig: {
    auth: {
      persistSession: boolean;
      autoRefreshToken: boolean;
      detectSessionInUrl: boolean;
      flowType: "pkce";
      storage: Storage | undefined;
      storageKey: string;
    };
    db: {
      schema: string;
    };
  };
  serviceConfig: {
    auth: {
      persistSession: boolean;
      autoRefreshToken: boolean;
    };
  };
  getRedirectUrl(action: keyof AuthConfig["redirectUrls"]): string;
  getRedirectPathForUserType(userType: UserType): string;
  getRedirectUrlForUserType(userType: UserType): string;
  getCallbackUrl(provider?: string, userType?: UserType): string;
  getPasswordResetOptions(): { redirectTo: string };
  getEmailVerificationOptions(): { redirectTo: string };
  getSignUpOptions(isVolunteer?: boolean): { redirectTo: string };
  getVolunteerConfirmOptions(): { redirectTo: string };
  getSchemaForUserType(userType: UserType): string;
  getTableNameForUserType(userType: UserType): string;
}

/**
 * Configuration for Supabase Auth
 * Used to ensure consistent redirect URLs and auth settings across the application
 */
export const authConfig: AuthConfig = {
  // URLs for auth redirects
  redirectUrls: {
    base: SITE_URL,
    login: `${SITE_URL}/login`,
    resetPassword: `${SITE_URL}/reset-password`,
    emailVerification: `${SITE_URL}/email-verification`,
    signUp: `${SITE_URL}/register`,
    volunteerSignUp: `${SITE_URL}/volunteer-register`,
    volunteerConfirm: `${SITE_URL}/volunteer-confirm`,
    callback: `${SITE_URL}/auth/callback`,
  },

  // Default redirect paths by user type
  userTypePaths: {
    recruit: "/dashboard",
    volunteer: "/volunteer-dashboard",
    admin: "/admin/dashboard",
  },

  // Auth storage configuration
  storage: {
    storageKey: "sfdsa_auth_token",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },

  // Database schema configuration
  schemas: {
    public: "public",
    recruit: "recruit",
    volunteer: "volunteer",
    admin: "admin",
  },

  // Auth client configuration
  clientConfig: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sfdsa_auth_token",
    },
    db: {
      schema: "public",
    },
  },

  // Service role configuration (server-side only)
  serviceConfig: {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },

  /**
   * Get redirect URL for a specific auth action
   */
  getRedirectUrl(action: keyof AuthConfig["redirectUrls"]): string {
    return this.redirectUrls[action];
  },

  /**
   * Get redirect path for a user type
   */
  getRedirectPathForUserType(userType: UserType): string {
    return this.userTypePaths[userType] || "/";
  },

  /**
   * Get full redirect URL for a user type
   */
  getRedirectUrlForUserType(userType: UserType): string {
    return `${this.redirectUrls.base}${this.getRedirectPathForUserType(userType)}`;
  },

  /**
   * Get callback URL with optional provider
   */
  getCallbackUrl(provider?: string, userType?: UserType): string {
    const url = this.redirectUrls.callback;
    const params = new URLSearchParams();

    if (provider) {
      params.set("provider", provider);
    }
    if (userType) {
      params.set("userType", userType);
    }

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  },

  /**
   * Configure auth redirect for password reset
   */
  getPasswordResetOptions(): { redirectTo: string } {
    return {
      redirectTo: this.redirectUrls.resetPassword,
    };
  },

  /**
   * Configure auth redirect for email verification
   */
  getEmailVerificationOptions(): { redirectTo: string } {
    return {
      redirectTo: this.redirectUrls.emailVerification,
    };
  },

  /**
   * Configure auth redirect for sign up
   */
  getSignUpOptions(isVolunteer = false): { redirectTo: string } {
    return {
      redirectTo: isVolunteer
        ? this.redirectUrls.volunteerSignUp
        : this.redirectUrls.signUp,
    };
  },

  /**
   * Configure auth redirect for volunteer confirmation
   */
  getVolunteerConfirmOptions(): { redirectTo: string } {
    return {
      redirectTo: this.redirectUrls.volunteerConfirm,
    };
  },

  /**
   * Get database schema for user type
   */
  getSchemaForUserType(userType: UserType): string {
    switch (userType) {
      case "recruit":
        return this.schemas.recruit;
      case "volunteer":
        return this.schemas.volunteer;
      case "admin":
        return this.schemas.admin;
      default:
        return this.schemas.public;
    }
  },

  /**
   * Get table name with schema for user type
   */
  getTableNameForUserType(userType: UserType): string {
    const schema = this.getSchemaForUserType(userType);
    return userType === "volunteer"
      ? `${schema}.recruiters`
      : `${schema}.users`;
  },
};
