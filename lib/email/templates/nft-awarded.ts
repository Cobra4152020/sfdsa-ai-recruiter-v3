interface NFTAwardedTemplateProps {
  recipientName: string
  nftName: string
  nftDescription: string
  nftImageUrl: string
  nftViewUrl: string
}

export function nftAwarded({
  recipientName,
  nftName,
  nftDescription,
  nftImageUrl,
  nftViewUrl,
}: NFTAwardedTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You've Been Awarded an NFT!</title>
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
        .nft-info {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          text-align: center;
        }
        .nft-image {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 10px 0;
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
          <p>You've been awarded a special NFT: <strong>${nftName}</strong>!</p>
          
          <div class="nft-info">
            <h2>${nftName}</h2>
            <img src="${nftImageUrl}" alt="${nftName}" class="nft-image">
            <p>${nftDescription}</p>
          </div>
          
          <p>This NFT is a unique digital asset that recognizes your exceptional achievement in the San Francisco Deputy Sheriff recruitment process.</p>
          
          <p>
            <a href="${nftViewUrl}" class="button">View Your NFT</a>
          </p>
          
          <p>If you have any questions about your NFT or the recruitment process, please don't hesitate to contact us.</p>
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
