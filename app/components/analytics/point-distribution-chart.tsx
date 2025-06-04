export interface PointDistribution {
  pointRange: string;
  userCount: number;
  percentage: number;
}

interface PointDistributionChartProps {
  data: PointDistribution[] | null;
}

export function PointDistributionChart({ data }: PointDistributionChartProps) {
  if (!data) {
    return <div>No point distribution data available</div>;
  }

  return (
    <div className="h-[400px]">
      {/* Implement chart visualization here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
