"use client";

import { useState } from "react";
import { DeploymentStatus } from "@/components/deployment-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Database, Trash, Download } from "lucide-react";

export default function DeploymentPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState<string | null>(null);

  const refreshLeaderboardView = async () => {
    setIsRefreshing(true);
    setRefreshResult(null);

    try {
      const response = await fetch("/api/admin/refresh-leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setRefreshResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setRefreshResult(`Error: ${error}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearBrowserCache = async () => {
    setIsClearing(true);
    setClearResult(null);

    try {
      // Clear application cache if available
      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
        setClearResult("Browser cache cleared successfully");
      } else {
        setClearResult("Cache API not available in this browser");
      }
    } catch (error) {
      setClearResult(`Error: ${error}`);
    } finally {
      setIsClearing(false);
    }
  };

  const downloadEnvironment = () => {
    const envData = {
      NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      NEXT_PUBLIC_ENABLE_LEADERBOARD:
        process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD,
      NEXT_PUBLIC_ENABLE_BADGES: process.env.NEXT_PUBLIC_ENABLE_BADGES,
      NEXT_PUBLIC_ENABLE_POINTS: process.env.NEXT_PUBLIC_ENABLE_POINTS,
      NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
      NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(envData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", `environment-${Date.now()}.json`);
    linkElement.click();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Deployment Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DeploymentStatus />

        <Card>
          <CardHeader>
            <CardTitle>Deployment Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                onClick={refreshLeaderboardView}
                disabled={isRefreshing}
                className="w-full"
              >
                <Database
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh Leaderboard Data
              </Button>
              {refreshResult && (
                <Textarea
                  value={refreshResult}
                  readOnly
                  className="mt-2 font-mono text-xs h-32"
                />
              )}
            </div>

            <div>
              <Button
                onClick={clearBrowserCache}
                disabled={isClearing}
                variant="outline"
                className="w-full"
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear Browser Cache
              </Button>
              {clearResult && <p className="mt-2 text-sm">{clearResult}</p>}
            </div>

            <div>
              <Button
                onClick={downloadEnvironment}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Environment Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="troubleshooting">
        <TabsList className="mb-4">
          <TabsTrigger value="troubleshooting">
            Troubleshooting Guide
          </TabsTrigger>
          <TabsTrigger value="deployment">Deployment Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Common Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Blank or loading screens:</strong> Check browser
                    console for JavaScript errors. Verify that all API endpoints
                    are returning valid responses.
                  </li>
                  <li>
                    <strong>Missing data:</strong> Verify database connection
                    and that required tables exist. Check that the leaderboard
                    view is properly refreshed.
                  </li>
                  <li>
                    <strong>Stale data:</strong> Use the &quot;Refresh
                    Leaderboard Data&quot; button to force a refresh of the
                    materialized views.
                  </li>
                  <li>
                    <strong>Browser caching:</strong> Use the &quot;Clear
                    Browser Cache&quot; button or press Ctrl+F5 to force a full
                    refresh.
                  </li>
                  <li>
                    <strong>Environment variables:</strong> Verify that all
                    required environment variables are set correctly.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Vercel Deployment Issues
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Environment variables not applied:</strong> Check
                    Vercel dashboard to ensure all environment variables are set
                    correctly.
                  </li>
                  <li>
                    <strong>Build failures:</strong> Check Vercel build logs for
                    errors. Ensure all dependencies are installed correctly.
                  </li>
                  <li>
                    <strong>Preview deployments:</strong> Test changes in
                    preview deployments before deploying to production.
                  </li>
                  <li>
                    <strong>Deployment cache:</strong> Consider triggering a
                    fresh deployment if changes are not reflected.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Verify all environment variables are set correctly</li>
                <li>Test changes in preview deployment before production</li>
                <li>Check database connection and required tables</li>
                <li>Verify API endpoints return expected responses</li>
                <li>Test with cache disabled to ensure fresh content</li>
                <li>Check browser console for JavaScript errors</li>
                <li>Verify assets are loading correctly</li>
                <li>Test on multiple browsers and devices</li>
                <li>Check feature flags are enabled as expected</li>
                <li>Verify leaderboard data is refreshed</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
