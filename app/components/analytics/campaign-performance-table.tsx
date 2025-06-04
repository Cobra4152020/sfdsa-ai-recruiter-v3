export interface CampaignPerformance {
  campaignId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalDonations: number;
  totalAmount: number;
  averageAmount: number;
  conversionRate: number;
  roi: number;
}

interface CampaignPerformanceTableProps {
  data: CampaignPerformance[] | null;
}

export function CampaignPerformanceTable({
  data,
}: CampaignPerformanceTableProps) {
  if (!data) {
    return <div>No campaign performance data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Donations</th>
            <th>Total Amount</th>
            <th>Average Amount</th>
            <th>Conversion Rate</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {data.map((campaign) => (
            <tr key={campaign.campaignId}>
              <td>{campaign.name}</td>
              <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
              <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
              <td>{campaign.totalDonations}</td>
              <td>${campaign.totalAmount.toFixed(2)}</td>
              <td>${campaign.averageAmount.toFixed(2)}</td>
              <td>{(campaign.conversionRate * 100).toFixed(1)}%</td>
              <td>{(campaign.roi * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
