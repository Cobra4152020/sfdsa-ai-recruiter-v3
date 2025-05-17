import { emailTheme, getEmailThemeValue } from '../theme';

interface ApplicationStatusTemplateProps {
  recipientName: string
  statusUpdate: string
  nextSteps: string[]
  dashboardUrl: string
}

export function applicationStatus({
  recipientName,
  statusUpdate,
  nextSteps,
  dashboardUrl,
}: ApplicationStatusTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Status Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: ${emailTheme.colors.text.primary};
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: ${emailTheme.spacing.padding};
        }
        .header {
          background-color: ${emailTheme.colors.primary};
          color: white;
          padding: ${emailTheme.spacing.padding};
          text-align: center;
        }
        .content {
          padding: ${emailTheme.spacing.padding};
          background-color: ${emailTheme.colors.background};
        }
        .status-update {
          background-color: white;
          border-radius: ${emailTheme.borderRadius};
          padding: 15px;
          margin: ${emailTheme.spacing.margin} 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .next-steps {
          background-color: white;
          border-radius: ${emailTheme.borderRadius};
          padding: 15px;
          margin: ${emailTheme.spacing.margin} 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          background-color: ${emailTheme.colors.accent};
          color: ${emailTheme.colors.primary};
          text-decoration: none;
          padding: 10px 20px;
          border-radius: ${emailTheme.borderRadius};
          margin-top: ${emailTheme.spacing.margin};
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: ${emailTheme.spacing.padding};
          font-size: 12px;
          color: ${emailTheme.colors.text.secondary};
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <p>Hello ${recipientName},</p>
          
          <div class="status-update">
            <h2>Your Current Status:</h2>
            <p>${statusUpdate}</p>
          </div>
          
          ${
            nextSteps.length > 0
              ? `
          <div class="next-steps">
            <h2>Next Steps:</h2>
            <ul>
              ${nextSteps.map((step) => `<li>${step}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }
          
          <p>
            <a href="${dashboardUrl}" class="button">View Your Dashboard</a>
          </p>
          
          <p>If you have any questions about your application status, please contact our recruitment team.</p>
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
