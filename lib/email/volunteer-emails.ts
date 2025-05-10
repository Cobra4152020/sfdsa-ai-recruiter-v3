import { sendEmail, type EmailResult } from "@/lib/email/send-email"
import { volunteerConfirmation } from "@/lib/email/templates/volunteer-confirmation"

/**
 * Sends a confirmation email to a new volunteer recruiter
 *
 * @param email The recipient's email address
 * @param name The recipient's name
 * @param confirmationUrl The URL to confirm their email
 * @returns Result of the email sending operation
 */
export async function sendVolunteerConfirmationEmail(
  email: string,
  name: string,
  confirmationUrl: string,
): Promise<EmailResult> {
  try {
    const html = volunteerConfirmation({
      recipientName: name,
      confirmationUrl,
    })

    return await sendEmail({
      to: email,
      subject: "Confirm Your SF Sheriff's Volunteer Recruiter Account",
      html,
    })
  } catch (error) {
    console.error("Error sending volunteer confirmation email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error sending confirmation email",
    }
  }
}
