interface HiredTemplateProps {
  firstName: string
  lastName: string
  trackingNumber: string
  dashboardUrl: string
  startDate?: string
  orientationDate?: string
}

export function hired({
  firstName,
  lastName,
  trackingNumber,
  dashboardUrl,
  startDate = "to be determined",
  orientationDate = "to be determined",
}: HiredTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations! You're Hired - San Francisco Deputy Sheriff</title>
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
        .congratulations {
          background-color: #FFD700;
          color: #0A3C1F;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
        }
        .next-steps {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .important-dates {
          background-color: #0A3C1F;
          color: white;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to the Team!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          
          <div class="congratulations">
            <p>Congratulations! You have been selected to join the San Francisco Deputy Sheriff's Department.</p>
          </div>
          
          <p>We are thrilled to welcome you to our team. Your dedication throughout the selection process has demonstrated that you have what it takes to serve and protect the people of San Francisco.</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          
          <div class="important-dates">
            <h2>Important Dates:</h2>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>Orientation:</strong> ${orientationDate}</p>
          </div>
          
          <div class="next-steps">
            <h2>Next Steps:</h2>
            <ol>
              <li><strong>Complete new hire paperwork</strong> - You will receive this package separately</li>
              <li><strong>Attend orientation</strong> - Details will be provided</li>
              <li><strong>Prepare for academy training</strong> - Review the materials that will be sent to you</li>
            </ol>
          </div>
          
          <p>A member of our HR team will contact you shortly with more details about your onboarding process. If you have any questions in the meantime, please contact hr@sfdeputysheriff.com.</p>
          
          <p>
            <a href="${dashboardUrl}" class="button">Access Onboarding Portal</a>
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
