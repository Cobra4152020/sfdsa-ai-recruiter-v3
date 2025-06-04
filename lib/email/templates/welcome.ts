interface WelcomeTemplateProps {
  recipientName: string;
  loginUrl: string;
}

export function welcome({
  recipientName,
  loginUrl,
}: WelcomeTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SF Deputy Sheriff Recruitment</title>
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
        .steps {
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
          <h1>Welcome, ${recipientName}!</h1>
        </div>
        <div class="content">
          <p>Thank you for your interest in becoming a San Francisco Deputy Sheriff. We're excited to have you begin this journey!</p>
          
          <div class="steps">
            <h2>Next Steps:</h2>
            <ol>
              <li>Complete your profile information</li>
              <li>Explore the available resources and preparation materials</li>
              <li>Track your progress through the recruitment process</li>
              <li>Earn badges as you complete different stages</li>
            </ol>
          </div>
          
          <p>Our recruitment platform is designed to guide you through each step of the process and help you prepare for a successful career in law enforcement.</p>
          
          <p>
            <a href="${loginUrl}" class="button">Log In to Your Account</a>
          </p>
          
          <p>If you have any questions, please don't hesitate to contact our recruitment team.</p>
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
