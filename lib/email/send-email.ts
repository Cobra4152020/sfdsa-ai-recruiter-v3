import { getResendClient, isEmailEnabled } from "./resend-client"

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer
  }>
  tags?: Array<{
    name: string
    value: string
  }>
}

const DEFAULT_FROM_EMAIL = "SF Deputy Sheriff Recruitment <recruitment@sfdsa.org>"

/**
 * Send an email using Resend
 * @param options Email options
 * @returns Object containing success status and message or data
 */
export async function sendEmail(options: EmailOptions) {
  try {
    // Check if email functionality is enabled
    if (!isEmailEnabled()) {
      console.log("Email sending skipped: Email functionality is disabled")
      return {
        success: false,
        message: "Email functionality is disabled",
      }
    }

    const resend = getResendClient()
    if (!resend) {
      return {
        success: false,
        message: "Resend client is not available",
      }
    }

    // Send email
    const { from = DEFAULT_FROM_EMAIL, ...restOptions } = options
    const result = await resend.emails.send({
      from,
      ...restOptions,
    })

    if (!result || !result.id) {
      throw new Error("Failed to send email: No ID returned")
    }

    console.log(`Email sent successfully: ${result.id}`)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
