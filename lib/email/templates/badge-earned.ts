interface BadgeEarnedTemplateProps {
  recipientName: string;
  badgeName: string;
  badgeDescription: string;
  badgeShareMessage?: string;
  badgeUrl: string;
}

export function badgeEarned({
  recipientName,
  badgeName,
  badgeDescription,
  badgeShareMessage,
  badgeUrl,
}: BadgeEarnedTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You've Earned a Badge!</title>
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
        .badge-info {
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
          <h1>Congratulations, ${recipientName}!</h1>
        </div>
        <div class="content">
          <p>You've earned the <strong>${badgeName}</strong> badge in your journey to become a San Francisco Deputy Sheriff!</p>
          
          <div class="badge-info">
            <h2>${badgeName}</h2>
            <p>${badgeDescription}</p>
            ${badgeShareMessage ? `<p><em>${badgeShareMessage}</em></p>` : ""}
          </div>
          
          <p>This badge recognizes your progress and commitment to the recruitment process. Keep up the great work!</p>
          
          <p>
            <a href="${badgeUrl}" class="button">View Your Badge</a>
          </p>
          
          <p>If you have any questions about your recruitment journey, please don't hesitate to contact us.</p>
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
