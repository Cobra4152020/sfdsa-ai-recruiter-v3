import { SupabaseHealthCheck } from "@/components/supabase-health-check";

export const metadata = {
  title: "Database Health Check",
  description:
    "Monitor and verify the health of your Supabase database connection",
};

export default function DatabaseHealthPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Database Health Check</h1>
      <div className="grid gap-6">
        <SupabaseHealthCheck />
      </div>
    </div>
  );
}
