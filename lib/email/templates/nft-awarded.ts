interface NFTAwardedTemplateProps {
  recipientName: string
  nftName: string
  nftDescription: string
  nftImageUrl: string
  tokenId: string
  contractAddress: string
  nftUrl: string
}

export function nftAwardedTemplate({
  recipientName,
  nftName,
  nftDescription,
  nftImageUrl,
  tokenId,
  contractAddress,
  nftUrl,
}: NFTAwardedTemplateProps): string {
  const currentYear = new Date().getFullYear()

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0A3C1F; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Congratulations, ${recipientName || "Recruit"}!</h1>
        <p style="margin-top: 10px;">You've earned an exclusive NFT award</p>
      </div>
      
      <div style="padding: 20px; text-align: center;">
        <div style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <img src="${nftImageUrl}" alt="${nftName}" style="max-width: 200px; margin-bottom: 15px;" />
          <h2 style="color: #0A3C1F; margin-top: 0;">${nftName}</h2>
          <p>${nftDescription}</p>
          <p style="font-size: 14px; color: #666;">Token ID: ${tokenId}</p>
          <p style="font-size: 14px; color: #666;">Contract: ${contractAddress}</p>
        </div>
        
        <p>This NFT is yours to keep forever and proves your dedication to the recruitment process!</p>
        
        <div style="margin-top: 30px;">
          <a href="${nftUrl}" style="background-color: #FFD700; color: #0A3C1F; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your NFT Award</a>
        </div>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>This email was sent by the San Francisco Deputy Sheriff's Association Recruitment Team.</p>
        <p>© ${currentYear} San Francisco Deputy Sheriff's Association</p>
      </div>
    </div>
  `
}
