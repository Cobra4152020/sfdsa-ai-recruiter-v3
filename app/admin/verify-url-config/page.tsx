"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface UrlConfigData {
  environmentVariables: Record<string, string>;
  databaseSettings: Record<string, unknown>;
  computedUrls: Record<string, string>;
  success: boolean;
  error?: string;
}

export default function VerifyUrlConfigPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UrlConfigData | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/verify-url-config");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch URL configuration");
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const isProduction = data?.environmentVariables?.NODE_ENV === "production";
  const hasCorrectSiteUrl =
    data?.environmentVariables?.NEXT_PUBLIC_SITE_URL?.includes(
      "sfdeputysheriff.com",
    );
  const allRedirectsCorrect =
    data?.computedUrls &&
    Object.values(data?.computedUrls ?? {}).every(
      (url) => typeof url === "string" && url.includes("sfdeputysheriff.com"),
    );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-900">
        URL Configuration Verification
      </h1>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-yellow-500" />
          <span className="ml-2 text-lg">Loading configuration...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid gap-6 mb-6">
            <Card
              className={
                isProduction && hasCorrectSiteUrl && allRedirectsCorrect
                  ? "border-green-500"
                  : "border-red-500"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isProduction && hasCorrectSiteUrl && allRedirectsCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  Configuration Status
                </CardTitle>
                <CardDescription>
                  {isProduction && hasCorrectSiteUrl && allRedirectsCorrect
                    ? "Your URL configuration appears to be correct"
                    : "There are issues with your URL configuration"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    {isProduction ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    )}
                    Environment: {data?.environmentVariables?.NODE_ENV}
                  </li>
                  <li className="flex items-center">
                    {hasCorrectSiteUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Site URL: {data?.environmentVariables?.NEXT_PUBLIC_SITE_URL}
                  </li>
                  <li className="flex items-center">
                    {allRedirectsCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Redirect URLs:{" "}
                    {allRedirectsCorrect ? "All correct" : "Some incorrect"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(data?.environmentVariables, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(data?.databaseSettings, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Computed URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(data?.computedUrls, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={fetchConfig}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Configuration
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
