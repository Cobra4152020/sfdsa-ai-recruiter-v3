interface WelcomeTemplateProps {
  recipientName: string
  loginUrl: string
}

export function welcomeTemplate({ recipientName, loginUrl }: WelcomeTemplateProps): string {
  const currentYear = new Date().getFullYear()

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0A3C1F; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Welcome, ${recipientName || "Recruit"}!</h1>
        <p style="margin-top: 10px;">Thank you for joining the SF Deputy Sheriff recruitment platform</p>
      </div>
      
      <div style="padding: 20px; text-align: center;">
        <p>We're excited to have you on board! Our platform is designed to help you navigate the recruitment process and prepare for a successful career with the San Francisco Sheriff's Office.</p>
        
        <div style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #0A3C1F; margin-top: 0;">What you can do:</h2>
          <ul style="text-align: left; list-style-position: inside;">
            <li>Track your progress through the recruitment process</li>
            <li>Earn badges for your achievements</li>
            <li>Compete on the leaderboard with other recruits</li>
            <li>Access resources to help you prepare</li>
            <li>Get personalized guidance from Sgt. Ken, our AI assistant</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px;">
          <a href="${loginUrl}" style="background-color: #FFD700; color: #0A3C1F; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started Now</a>
        </div>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>This email was sent by the San Francisco Deputy Sheriff's Association Recruitment Team.</p>
        <p>© ${currentYear} San Francisco Deputy Sheriff's Association</p>
      </div>
    </div>
  `
}
