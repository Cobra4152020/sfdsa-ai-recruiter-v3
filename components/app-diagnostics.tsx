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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { testAllApiEndpoints } from "@/lib/api-test-utils";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Link2,
  Database,
  Layers,
} from "lucide-react";

export function AppDiagnostics() {
  const [apiResults, setApiResults] = useState<
    Array<{
      endpoint: string;
      success: boolean;
      status: number;
      message: string;
    }>
  >([]);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [routeResults, setRouteResults] = useState<
    Array<{
      route: string;
      exists: boolean;
      message: string;
    }>
  >([]);
  const [isTestingRoutes, setIsTestingRoutes] = useState(false);
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});
  const [browserInfo, setBrowserInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    // Collect browser information
    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: `${window.screen.width}px`,
      screenHeight: `${window.screen.height}px`,
      viewportWidth: `${window.innerWidth}px`,
      viewportHeight: `${window.innerHeight}px`,
      devicePixelRatio: window.devicePixelRatio.toString(),
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    });

    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_VERCEL_ENV: !!process.env.NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_ENABLE_LEADERBOARD:
        !!process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD,
      NEXT_PUBLIC_ENABLE_BADGES: !!process.env.NEXT_PUBLIC_ENABLE_BADGES,
      NEXT_PUBLIC_ENABLE_POINTS: !!process.env.NEXT_PUBLIC_ENABLE_POINTS,
      NEXT_PUBLIC_ENABLE_DEBUG: !!process.env.NEXT_PUBLIC_ENABLE_DEBUG,
    });

    // Run initial tests
    testApis();
    testRoutes();
  }, []);

  const testApis = async () => {
    setIsTestingApi(true);
    try {
      const results = await testAllApiEndpoints();
      setApiResults(results);
    } catch (error) {
      console.error("Error testing APIs:", error);
    } finally {
      setIsTestingApi(false);
    }
  };

  const testRoutes = async () => {
    setIsTestingRoutes(true);
    const routes = [
      "/",
      "/awards",
      "/badges",
      "/trivia",
      "/profile/1",
      "/gi-bill",
      "/discounted-housing",
    ];

    const results = await Promise.all(
      routes.map(async (route) => {
        try {
          const response = await fetch(route, { method: "HEAD" });
          return {
            route,
            exists: response.ok,
            message: response.ok
              ? "Route exists"
              : `Route error: ${response.status}`,
          };
        } catch (error) {
          return {
            route,
            exists: false,
            message: `Error checking route: ${error instanceof Error ? error.message : String(error)}`,
          };
        }
      }),
    );

    setRouteResults(results);
    setIsTestingRoutes(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Application Diagnostics</CardTitle>
        <CardDescription>
          Test and verify the application&apos;s functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="api">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="api">API Endpoints</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="env">Environment</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">API Endpoint Tests</h3>
                <Button onClick={testApis} disabled={isTestingApi} size="sm">
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isTestingApi ? "animate-spin" : ""}`}
                  />
                  {isTestingApi ? "Testing..." : "Run Tests"}
                </Button>
              </div>

              <div className="space-y-2">
                {apiResults.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No test results yet
                  </div>
                ) : (
                  apiResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border flex items-start ${
                        result.success
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      }`}
                    >
                      <div className="mr-3 mt-0.5">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{result.endpoint}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Status: {result.status} - {result.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Route Tests</h3>
                <Button
                  onClick={testRoutes}
                  disabled={isTestingRoutes}
                  size="sm"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isTestingRoutes ? "animate-spin" : ""}`}
                  />
                  {isTestingRoutes ? "Testing..." : "Run Tests"}
                </Button>
              </div>

              <div className="space-y-2">
                {routeResults.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No test results yet
                  </div>
                ) : (
                  routeResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border flex items-start ${
                        result.exists
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      }`}
                    >
                      <div className="mr-3 mt-0.5">
                        {result.exists ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{result.route}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {result.message}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(result.route, "_blank")}
                        className="ml-2"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="env">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Environment Variables</h3>

              <div className="space-y-2">
                {Object.entries(envVars).map(([key, exists]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border flex items-start ${
                      exists
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                    }`}
                  >
                    <div className="mr-3 mt-0.5">
                      {exists ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{key}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {exists ? "Available" : "Not available"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="browser">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Browser Information</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="user-agent">
                  <AccordionTrigger>User Agent</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 bg-muted rounded text-sm font-mono overflow-x-auto">
                      {browserInfo.userAgent}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="display">
                  <AccordionTrigger>Display Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">Screen Size</div>
                        <div>
                          {browserInfo.screenWidth} × {browserInfo.screenHeight}
                        </div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">
                          Viewport Size
                        </div>
                        <div>
                          {browserInfo.viewportWidth} ×{" "}
                          {browserInfo.viewportHeight}
                        </div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">Pixel Ratio</div>
                        <div>{browserInfo.devicePixelRatio}</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">
                          Color Scheme
                        </div>
                        <div className="capitalize">
                          {browserInfo.colorScheme}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="platform">
                  <AccordionTrigger>Platform Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">Platform</div>
                        <div>{browserInfo.platform}</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-xs text-gray-500">Language</div>
                        <div>{browserInfo.language}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <div className="flex space-x-2">
            <Badge variant="outline" className="flex items-center">
              <Server className="h-3 w-3 mr-1" />
              API: {apiResults.filter((r) => r.success).length}/
              {apiResults.length}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Link2 className="h-3 w-3 mr-1" />
              Routes: {routeResults.filter((r) => r.exists).length}/
              {routeResults.length}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Env: {Object.values(envVars).filter(Boolean).length}/
              {Object.values(envVars).length}
            </Badge>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Layers className="h-3 w-3 mr-1" />
            Next.js{" "}
            {process.env.NEXT_PUBLIC_BUILD_ID ? "Production" : "Development"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
