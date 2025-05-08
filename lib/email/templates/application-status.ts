interface ApplicationStatusTemplateProps {
  recipientName: string
  statusUpdate: string
  nextSteps: string[]
  dashboardUrl: string
}

export function applicationStatusTemplate({
  recipientName,
  statusUpdate,
  nextSteps,
  dashboardUrl,
}: ApplicationStatusTemplateProps): string {
  const currentYear = new Date().getFullYear()
  const nextStepsList = nextSteps.map((step) => `<li>${step}</li>`).join("")

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0A3C1F; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Application Update</h1>
        <p style="margin-top: 10px;">For ${recipientName || "Recruit"}</p>
      </div>
      
      <div style="padding: 20px; text-align: center;">
        <div style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: left;">
          <h2 style="color: #0A3C1F; margin-top: 0;">Status Update</h2>
          <p>${statusUpdate}</p>
          
          <h3 style="color: #0A3C1F; margin-top: 20px;">Next Steps:</h3>
          <ul>
            ${nextStepsList}
          </ul>
        </div>
        
        <div style="margin-top: 30px;">
          <a href="${dashboardUrl}" style="background-color: #FFD700; color: #0A3C1F; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Dashboard</a>
        </div>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>This email was sent by the San Francisco Deputy Sheriff's Association Recruitment Team.</p>
        <p>© ${currentYear} San Francisco Deputy Sheriff's Association</p>
      </div>
    </div>
  `
}
