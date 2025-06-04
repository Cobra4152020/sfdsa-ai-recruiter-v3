interface ContactedTemplateProps {
  firstName: string;
  trackingNumber: string;
  dashboardUrl: string;
  contactDate?: string;
  contactMethod?: string;
}

export function contacted({
  firstName,
  trackingNumber,
  dashboardUrl,
  contactDate = "recently",
  contactMethod = "email",
}: ContactedTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We've Reached Out - San Francisco Deputy Sheriff</title>
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
        .contact-info {
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
          <h1>We've Reached Out</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          
          <p>Our recruitment team has attempted to contact you via ${contactMethod} ${contactDate} regarding your interest in joining the San Francisco Deputy Sheriff's Department.</p>
          
          <p>Your application tracking number is:</p>
          <div class="tracking-number">
            ${trackingNumber}
          </div>
          
          <div class="contact-info">
            <h2>Important Information:</h2>
            <p>If you haven't received our communication, please check your spam folder or contact us directly:</p>
            <ul>
              <li>Email: recruitment@sfdeputysheriff.com</li>
              <li>Phone: (415) 555-1234</li>
              <li>Office Hours: Monday-Friday, 9am-5pm PT</li>
            </ul>
          </div>
          
          <p>Please respond to our outreach as soon as possible to keep your application active. We're excited to discuss the next steps in the recruitment process with you.</p>
          
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
