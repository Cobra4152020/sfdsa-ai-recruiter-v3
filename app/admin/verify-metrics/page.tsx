import { PerformanceMetricsVerifier } from "@/components/performance-metrics-verifier"

export const metadata = {
  title: "Verify Performance Metrics | SFDSA AI Recruiter",
  description: "Verify that performance metrics are being collected correctly",
}

export default function VerifyMetricsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Verify Performance Metrics</h1>
      <PerformanceMetricsVerifier />
    </div>
  )
}
