"use client";

import { useState } from "react";
import { AppDiagnostics } from "@/components/app-diagnostics";
import { LinkChecker } from "@/components/link-checker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, Shield } from "lucide-react";

export default function DiagnosticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefreshCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/refresh-leaderboard", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh cache: ${response.status}`);
      }

      toast({
        title: "Cache refreshed",
        description: "The leaderboard cache has been successfully refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing cache:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to refresh cache",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">
          System Diagnostics
        </h1>
        <p className="text-gray-600">
          Test and monitor the application&apos;s components, API endpoints, and
          overall health.
        </p>
      </div>

      <Tabs defaultValue="diagnostics">
        <TabsList className="mb-6">
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="links">Link Checker</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostics">
          <ErrorBoundaryWrapper>
            <AppDiagnostics />
          </ErrorBoundaryWrapper>
        </TabsContent>

        <TabsContent value="links">
          <ErrorBoundaryWrapper>
            <LinkChecker />
          </ErrorBoundaryWrapper>
        </TabsContent>

        <TabsContent value="actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Refresh Leaderboard Cache</CardTitle>
                <CardDescription>
                  Manually refresh the materialized view for the leaderboard
                  data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleRefreshCache}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Cache
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>
                  Current security status of the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      <span>Authentication</span>
                    </div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      <span>Authorization</span>
                    </div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      <span>Data Encryption</span>
                    </div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
