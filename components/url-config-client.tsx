"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface UrlConfigApiResponse {
  isValid: boolean;
  environment: string;
  siteUrl: string;
  envVars: Record<string, string | undefined>;
  computedUrls: Record<string, string>;
}

export function URLConfigClient() {
  const [configData, setConfigData] = useState<UrlConfigApiResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/check-site-url");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConfigData(data);
    } catch (err) {
      console.error("Error fetching URL config:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch URL configuration",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div className="text-center py-4">
          <div
            className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-[#0A3C1F] rounded-full"
            aria-hidden="true"
          ></div>
          <p className="mt-2">Checking URL configuration...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {configData && (
            <>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Configuration Status</h3>
                <p
                  className={
                    configData.isValid
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {configData.isValid
                    ? "✓ URL configuration is valid"
                    : "✗ There are issues with your URL configuration"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Environment: {configData.environment}
                </p>
                <p className="text-sm text-gray-500">
                  Site URL: {configData.siteUrl}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(configData.envVars, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Computed URLs</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(configData.computedUrls, null, 2)}
                </pre>
              </div>

              <div className="mt-4">
                <Button onClick={fetchConfig} variant="outline">
                  Refresh Configuration
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
