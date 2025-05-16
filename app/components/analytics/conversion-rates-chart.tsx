export interface ConversionRate {
  referralSource: string;
  pageViews: number;
  formStarts: number;
  completions: number;
  conversionRate: number;
  avgAmount: number;
}

interface ConversionRatesChartProps {
  data: ConversionRate[] | null;
}

export function ConversionRatesChart({ data }: ConversionRatesChartProps) {
  if (!data) {
    return <div>No conversion data available</div>;
  }

  return (
    <div className="h-[400px]">
      {/* Implement chart visualization here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
} 