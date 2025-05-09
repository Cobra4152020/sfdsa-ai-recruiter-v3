import { Resend } from "resend"

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
}

export interface EmailResult {
  success: boolean
  message?: string
  data?: {
    id: string
  }
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, from = "SF Deputy Sheriff Recruitment <noreply@sfdeputysheriff.com>", ...rest } = options

  // Check if we have a Resend API key
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not set. Email will not be sent.")
    return {
      success: false,
      message: "RESEND_API_KEY is not set",
    }
  }

  try {
    const resend = new Resend(resendApiKey)

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...rest,
    })

    return {
      success: true,
      data: {
        id: data.id,
      },
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
