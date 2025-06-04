export interface DonationStats {
  total_donations: number;
  total_amount: number;
  average_amount: number;
  donor_count: number;
  recurring_count: number;
}

interface DonationStatsCardsProps {
  data: DonationStats | null;
}

export function DonationStatsCards({ data }: DonationStatsCardsProps) {
  if (!data) {
    return <div>No stats available</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard title="Total Donations" value={data.total_donations} />
      <StatCard
        title="Total Amount"
        value={`$${data.total_amount.toFixed(2)}`}
      />
      <StatCard
        title="Average Amount"
        value={`$${data.average_amount.toFixed(2)}`}
      />
      <StatCard title="Unique Donors" value={data.donor_count} />
      <StatCard title="Recurring Donors" value={data.recurring_count} />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
