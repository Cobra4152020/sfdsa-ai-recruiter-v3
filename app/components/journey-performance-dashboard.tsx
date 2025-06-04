interface JourneyData {
  summaries: Array<{
    id: string;
    total_users: number;
    completion_rate: number;
    avg_time_spent: number;
    created_at: string;
  }>;
  steps: Array<{
    id: string;
    step_name: string;
    completion_count: number;
    dropout_count: number;
    avg_time_spent: number;
  }>;
  funnels: Array<{
    id: string;
    funnel_name: string;
    start_count: number;
    end_count: number;
    conversion_rate: number;
  }>;
}

interface JourneyPerformanceDashboardProps {
  data: JourneyData | null;
}

export function JourneyPerformanceDashboard({
  data,
}: JourneyPerformanceDashboardProps) {
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Render journey performance data */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
