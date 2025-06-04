import { emailTheme } from "../../theme";

interface RejectedTemplateProps {
  firstName: string;
  lastName: string;
  trackingNumber: string;
  dashboardUrl: string;
  reapplyDate?: string;
}

export function rejected({
  firstName,
  lastName, // eslint-disable-line @typescript-eslint/no-unused-vars
  trackingNumber,
  dashboardUrl, // eslint-disable-line @typescript-eslint/no-unused-vars
  reapplyDate = "in six months",
}: RejectedTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Status Update - San Francisco Deputy Sheriff</title>
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
        .feedback {
          background-color: white;
          border-radius: ${emailTheme.borderRadius};
          padding: 15px;
          margin: ${emailTheme.spacing.margin} 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .future-opportunities {
          background-color: ${emailTheme.colors.backgroundAlt};
          border-radius: ${emailTheme.borderRadius};
          padding: 15px;
          margin: ${emailTheme.spacing.margin} 0;
        }
        .button {
          display: inline-block;
          background-color: ${emailTheme.colors.primary};
          color: white;
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
          <p>Hello ${firstName},</p>
          
          <p>Thank you for your interest in joining the San Francisco Deputy Sheriff's Department and for the time you invested in the application process.</p>
          
          <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          
          <div class="feedback">
            <h2>Feedback and Development:</h2>
            <p>The Deputy Sheriff position is highly competitive, and we receive many qualified applications. While we cannot provide specific feedback on individual applications, we encourage you to:</p>
            <ul>
              <li>Review our minimum qualifications and ensure you meet all requirements</li>
              <li>Consider gaining additional relevant experience or education</li>
              <li>Prepare thoroughly for all aspects of the testing process if you apply again</li>
            </ul>
          </div>
          
          <div class="future-opportunities">
            <h2>Future Opportunities:</h2>
            <p>You are welcome to reapply ${reapplyDate}. We also encourage you to explore other positions within the San Francisco Sheriff's Department or other public safety agencies that might align with your skills and interests.</p>
          </div>
          
          <p>We appreciate your interest in serving the community of San Francisco and wish you success in your career endeavors.</p>
          
          <p>
            <a href="https://careers.sf.gov" class="button">Explore Other Opportunities</a>
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
