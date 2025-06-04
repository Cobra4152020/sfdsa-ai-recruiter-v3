interface DonationReceiptProps {
  amount: number;
  donorName: string;
  donationDate: string;
  donationId: string;
  isRecurring: boolean;
}

export function donationReceiptTemplate({
  amount,
  donorName,
  donationDate,
  donationId,
  isRecurring,
}: DonationReceiptProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Donation Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .receipt-details {
          margin-bottom: 30px;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .thank-you {
          text-align: center;
          margin-top: 30px;
          font-size: 18px;
          color: #0A3C1F;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://sfdeputysheriff.com/logo.png" alt="SFDSA Logo" class="logo">
        <h1>Thank You for Your Donation!</h1>
      </div>
      
      <div class="receipt">
        <div class="receipt-header">
          <h2>Donation Receipt</h2>
          <p>Tax ID: 12-3456789</p>
        </div>
        
        <div class="receipt-details">
          <div class="receipt-row">
            <strong>Donor:</strong>
            <span>${donorName}</span>
          </div>
          <div class="receipt-row">
            <strong>Date:</strong>
            <span>${donationDate}</span>
          </div>
          <div class="receipt-row">
            <strong>Amount:</strong>
            <span>$${amount.toFixed(2)}</span>
          </div>
          <div class="receipt-row">
            <strong>Transaction ID:</strong>
            <span>${donationId}</span>
          </div>
          <div class="receipt-row">
            <strong>Type:</strong>
            <span>${isRecurring ? "Recurring Monthly Donation" : "One-time Donation"}</span>
          </div>
        </div>
        
        <p>This letter serves as your official receipt for tax purposes. No goods or services were provided in exchange for this contribution.</p>
      </div>
      
      <div class="thank-you">
        <p>Your support helps us build a stronger, safer San Francisco!</p>
      </div>
      
      <div class="footer">
        <p>Protecting San Francisco is a 501(c)(3) non-profit organization.</p>
        <p>123 Main Street, San Francisco, CA 94103</p>
        <p>If you have any questions, please contact us at donations@sfdeputysheriff.com</p>
      </div>
    </body>
    </html>
  `;
}
