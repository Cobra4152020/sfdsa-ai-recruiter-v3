interface InterestedTemplateProps {
  firstName: string
  lastName: string
  trackingNumber: string
  dashboardUrl: string
  applicationUrl: string
}

export function interested({
  firstName,
  lastName,
  trackingNumber,
  dashboardUrl,
  applicationUrl = "https://careers.sf.gov/interest/public-safety/sheriff/",
}: InterestedTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Next Steps in Your Application - San Francisco Deputy Sheriff</title>
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
        .tracking-number {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          text-align: center;
          margin: 20px 0;
          font-size: 16px;
        }
        .next-steps {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
        .button-secondary {
          display: inline-block;
          background-color: #0A3C1F;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
          margin-left: 10px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Next Steps in Your Application</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          
          <p>Thank you for expressing interest in joining the San Francisco Deputy Sheriff's Department. We're excited to move forward with your application process!</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          
          <div class="next-steps">
            <h2>Important Next Steps:</h2>
            <ol>
              <li><strong>Complete the official application</strong> - Please visit the official San Francisco careers portal to submit your formal application</li>
              <li><strong>Prepare for the written exam</strong> - Review our study materials and preparation guides</li>
              <li><strong>Gather required documents</strong> - You'll need identification, education records, and other documentation</li>
            </ol>
          </div>
          
          <p>The San Francisco Deputy Sheriff's Department offers competitive salaries, excellent benefits, and opportunities for advancement. We're looking for dedicated individuals who want to serve their community.</p>
          
          <p>
            <a href="${applicationUrl}" class="button">Complete Official Application</a>
            <a href="${dashboardUrl}" class="button-secondary">Track Your Progress</a>
          </p>
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
