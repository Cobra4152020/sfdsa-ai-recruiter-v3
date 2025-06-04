import { PerformanceDashboard } from "@/components/performance-dashboard";

export const metadata = {
  title: "Performance Dashboard | SFDSA AI Recruiter",
  description: "Monitor and analyze application performance metrics",
};

export default function PerformancePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      <PerformanceDashboard />
    </div>
  );
}
