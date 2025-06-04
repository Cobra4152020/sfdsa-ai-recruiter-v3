"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trackCustomPerformance } from "@/lib/performance-monitoring";
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import type { PerformanceMetric } from "@/lib/performance-monitoring";

export function PerformanceMetricsVerifier() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    apiEndpoint: "success" | "error" | "pending";
    dbStorage: "success" | "error" | "pending";
    metricsCount: number | null;
    latestMetrics: PerformanceMetric[] | null;
    error?: string;
  }>({
    apiEndpoint: "pending",
    dbStorage: "pending",
    metricsCount: null,
    latestMetrics: null,
  });

  // Function to generate a test metric
  const generateTestMetric = async () => {
    const startTime = performance.now();

    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Track a custom performance metric
    trackCustomPerformance("test-metric", startTime);

    return true;
  };

  // Function to check if metrics are being collected
  const checkMetricsCollection = async () => {
    setIsChecking(true);
    setCheckResults({
      apiEndpoint: "pending",
      dbStorage: "pending",
      metricsCount: null,
      latestMetrics: null,
    });

    try {
      // Step 1: Generate a test metric
      await generateTestMetric();

      // Wait a moment for the metric to be processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Check if the API endpoint is working
      let apiEndpointStatus: "success" | "error" = "error";

      try {
        const apiResponse = await fetch("/api/performance/test-endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "api-test-metric",
            value: 123.45,
            rating: "good",
            path: "/performance-test",
            timestamp: Date.now(),
          }),
        });

        if (apiResponse.ok) {
          apiEndpointStatus = "success";
        }
      } catch (error) {
        console.error("API endpoint test failed:", error);
      }

      // Step 3: Check if metrics are being stored in the database
      let dbStorageStatus: "success" | "error" = "error";
      let metricsCount = null;
      let latestMetrics = null;

      try {
        const dbResponse = await fetch("/api/performance/check-metrics");

        if (dbResponse.ok) {
          const data = await dbResponse.json();
          dbStorageStatus = data.success ? "success" : "error";
          metricsCount = data.count || 0;
          latestMetrics = data.latestMetrics || [];
        }
      } catch (error) {
        console.error("Database storage test failed:", error);
      }

      // Update the results
      setCheckResults({
        apiEndpoint: apiEndpointStatus,
        dbStorage: dbStorageStatus,
        metricsCount,
        latestMetrics,
      });
    } catch (error: unknown) {
      setCheckResults({
        apiEndpoint: "error",
        dbStorage: "error",
        metricsCount: null,
        latestMetrics: null,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Run the check when the component mounts
  useEffect(() => {
    checkMetricsCollection();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Performance Metrics Verification</CardTitle>
        <CardDescription>
          Verify that performance metrics are being collected and stored
          correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {checkResults.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{checkResults.error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">API Endpoint</h3>
              {checkResults.apiEndpoint === "pending" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : checkResults.apiEndpoint === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {checkResults.apiEndpoint === "pending"
                ? "Checking if the API endpoint is working..."
                : checkResults.apiEndpoint === "success"
                  ? "The API endpoint is working correctly."
                  : "The API endpoint is not working correctly."}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Database Storage</h3>
              {checkResults.dbStorage === "pending" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : checkResults.dbStorage === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {checkResults.dbStorage === "pending"
                ? "Checking if metrics are being stored in the database..."
                : checkResults.dbStorage === "success"
                  ? `Metrics are being stored correctly. Total count: ${checkResults.metricsCount}`
                  : "Metrics are not being stored correctly."}
            </p>
          </div>
        </div>

        {checkResults.latestMetrics &&
          checkResults.latestMetrics.length > 0 && (
            <div className="border rounded-lg p-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Latest Metrics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Path
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {checkResults.latestMetrics.map((metric, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {metric.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {metric.value.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              metric.rating === "good"
                                ? "bg-green-100 text-green-800"
                                : metric.rating === "needs-improvement"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {metric.rating}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {metric.path || "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {new Date(metric.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkMetricsCollection} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Verification
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
