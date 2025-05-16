import { Resend } from "resend"

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY

// Create a singleton instance of Resend
let resendInstance: Resend | null = null

/**
 * Get the Resend client instance
 * @returns Resend client instance or null if API key is not available
 */
export function getResendClient(): Resend | null {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not defined. Email functionality will be disabled.")
    return null
  }

  if (!resendInstance) {
    resendInstance = new Resend(resendApiKey)
  }

  return resendInstance
}

/**
 * Check if email functionality is available
 * @returns boolean indicating if email functionality is available
 */
export function isEmailEnabled(): boolean {
  return !!resendApiKey
}
