import { constructUrl } from "./url-utils"

/**
 * Configuration for Supabase Auth
 * Used to ensure consistent redirect URLs across the application
 */
export const authConfig = {
  // URLs for auth redirects
  redirectUrls: {
    login: constructUrl("/login"),
    resetPassword: constructUrl("/reset-password"),
    emailVerification: constructUrl("/email-verification"),
    signUp: constructUrl("/register"),
    volunteerSignUp: constructUrl("/volunteer-register"),
  },

  /**
   * Get redirect URL for a specific auth action
   */
  getRedirectUrl(action: keyof typeof authConfig.redirectUrls): string {
    return authConfig.redirectUrls[action]
  },

  /**
   * Configure auth redirect for password reset
   */
  getPasswordResetOptions() {
    return {
      redirectTo: authConfig.redirectUrls.resetPassword,
    }
  },

  /**
   * Configure auth redirect for email verification
   */
  getEmailVerificationOptions() {
    return {
      redirectTo: authConfig.redirectUrls.emailVerification,
    }
  },

  /**
   * Configure auth redirect for sign up
   */
  getSignUpOptions(isVolunteer = false) {
    return {
      redirectTo: isVolunteer ? authConfig.redirectUrls.volunteerSignUp : authConfig.redirectUrls.signUp,
    }
  },
}
