import { emailTheme } from "../../theme";

interface PendingTemplateProps {
  firstName: string;
  lastName: string;
  trackingNumber: string;
  dashboardUrl: string;
}

export function pending({
  firstName,
  lastName, // eslint-disable-line @typescript-eslint/no-unused-vars
  trackingNumber,
  dashboardUrl,
}: PendingTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received - San Francisco Deputy Sheriff</title>
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
        .tracking-number {
          background-color: ${emailTheme.colors.backgroundAlt};
          padding: 10px;
          border-radius: ${emailTheme.borderRadius};
          font-family: monospace;
          text-align: center;
          margin: ${emailTheme.spacing.margin} 0;
          font-size: 16px;
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
          <h1>Application Received</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          
          <p>Thank you for your interest in joining the San Francisco Deputy Sheriff's Department. We have received your initial information and are reviewing it.</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          <p>Please keep this number for your records and reference it in any future communications.</p>
          
          <div class="next-steps">
            <h2>Next Steps:</h2>
            <ol>
              <li>Our recruitment team will review your information</li>
              <li>You will receive an email when your application status changes</li>
              <li>You may be contacted for additional information or to schedule an initial screening</li>
            </ol>
          </div>
          
          <p>If you have any questions about your application, please contact our recruitment team at recruitment@sfdeputysheriff.com or call (415) 555-1234.</p>
          
          <p>
            <a href="${dashboardUrl}" class="button">Track Your Application</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} San Francisco Sheriff's Department. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
