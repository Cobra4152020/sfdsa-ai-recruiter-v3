/**
 * Configuration for Supabase Auth
 * Used to ensure consistent redirect URLs across the application
 */
export const authConfig = {
  // URLs for auth redirects - hardcoded for production to ensure consistency
  redirectUrls: {
    login: "https://www.sfdeputysheriff.com/login",
    resetPassword: "https://www.sfdeputysheriff.com/reset-password",
    emailVerification: "https://www.sfdeputysheriff.com/email-verification",
    signUp: "https://www.sfdeputysheriff.com/register",
    volunteerSignUp: "https://www.sfdeputysheriff.com/volunteer-register",
    volunteerConfirm: "https://www.sfdeputysheriff.com/volunteer-confirm",
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

  /**
   * Configure auth redirect for volunteer confirmation
   */
  getVolunteerConfirmOptions() {
    return {
      redirectTo: authConfig.redirectUrls.volunteerConfirm,
    }
  },
}
