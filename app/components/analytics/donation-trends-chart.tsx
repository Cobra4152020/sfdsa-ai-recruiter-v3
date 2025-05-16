export interface DonationTrend {
  date: string;
  total_amount: number;
  donation_count: number;
  unique_donors: number;
}

interface DonationTrendsChartProps {
  data: DonationTrend[] | null;
}

export function DonationTrendsChart({ data }: DonationTrendsChartProps) {
  if (!data) {
    return <div>No trend data available</div>;
  }

  return (
    <div className="h-[400px]">
      {/* Implement chart visualization here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
} 