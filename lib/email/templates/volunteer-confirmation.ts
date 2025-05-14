interface VolunteerConfirmationTemplateProps {
  recipientName: string
  confirmationUrl: string
}

export function volunteerConfirmation({ recipientName, confirmationUrl }: VolunteerConfirmationTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Volunteer Recruiter Account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #0A3C1F;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .button {
          display: inline-block;
          background-color: #FFD700;
          color: #0A3C1F;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .important {
          border-left: 4px solid #0A3C1F;
          padding-left: 15px;
          margin: 20px 0;
          background-color: #f0f0f0;
          padding: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirm Your Volunteer Recruiter Account</h1>
        </div>
        <div class="content">
          <p>Hello ${recipientName},</p>
          
          <p>Thank you for registering as a Volunteer Recruiter with the San Francisco Sheriff's Department. We're excited to have you join our team!</p>
          
          <p>To complete your registration and access the Volunteer Recruiter dashboard, please confirm your email address by clicking the button below:</p>
          
          <p style="text-align: center;">
            <a href="${confirmationUrl}" class="button">Confirm Email Address</a>
          </p>
          
          <div class="important">
            <p><strong>Important:</strong> This confirmation link will expire in 24 hours. If you don't confirm your email within this time, you'll need to register again.</p>
          </div>
          
          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; background-color: #eee; padding: 10px; font-size: 12px;">
            ${confirmationUrl}
          </p>
          
          <p>If you did not register for a Volunteer Recruiter account, please disregard this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} San Francisco Sheriff's Department. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
