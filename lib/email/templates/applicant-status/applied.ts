import { emailTheme } from "../../theme";

interface AppliedTemplateProps {
  firstName: string;
  trackingNumber: string;
  dashboardUrl: string;
  examDate?: string;
}

export function applied({
  firstName,
  trackingNumber,
  dashboardUrl,
  examDate = "to be scheduled",
}: AppliedTemplateProps): string {
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
        .exam-info {
          background-color: ${emailTheme.colors.accent};
          color: ${emailTheme.colors.primary};
          border-radius: ${emailTheme.borderRadius};
          padding: 15px;
          margin: ${emailTheme.spacing.margin} 0;
          font-weight: bold;
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
          <h1>Application Confirmed</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          
          <p>Congratulations! We have received your completed application for the position of Deputy Sheriff with the San Francisco Sheriff's Department.</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          
          <div class="exam-info">
            <h2>Written Exam Information:</h2>
            <p>Your written exam is ${examDate}.</p>
            <p>You will receive a separate email with the exact date, time, and location details.</p>
          </div>
          
          <div class="next-steps">
            <h2>Prepare for Success:</h2>
            <ul>
              <li><strong>Study for the written exam</strong> - Review our preparation materials</li>
              <li><strong>Prepare for the physical fitness test</strong> - Start training now</li>
              <li><strong>Gather your documentation</strong> - Have your ID, education records, and other required documents ready</li>
            </ul>
          </div>
          
          <p>The selection process includes multiple steps: written exam, physical fitness test, background check, medical evaluation, and psychological evaluation. We'll guide you through each step.</p>
          
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
