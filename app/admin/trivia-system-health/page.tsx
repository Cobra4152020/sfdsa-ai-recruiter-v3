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
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  FileText,
  Clock,
  Info,
} from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";

interface SystemHealthData {
  status: string;
  timestamp: string;
  databaseConnection: boolean;
  questionsAvailable: Record<
    string,
    {
      count: number;
      error: string | null;
    }
  >;
  fallbackQuestionsAvailable: Record<
    string,
    {
      available: boolean;
      source: string;
      count: number;
      error?: string;
    }
  >;
  error: string | null;
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  context: Record<string, unknown>;
  error_details: string | null;
}

export default function TriviaSystemHealthPage() {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchSystemHealth = async (gameId: string | null = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = gameId
        ? `/api/trivia/diagnostics?gameId=${gameId}`
        : "/api/trivia/diagnostics";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      console.error("Error fetching trivia system health:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    setIsLoadingLogs(true);

    try {
      const response = await fetch(
        "/api/admin/logs/recent?component=trivia-api&limit=50",
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setRecentLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    fetchRecentLogs();

    // Set up polling for logs
    const interval = setInterval(() => {
      fetchRecentLogs();
    }, 30000); // Refresh logs every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    fetchSystemHealth(gameId);
  };

  const formatGameName = (gameId: string) => {
    return gameId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getLogLevelColor = (level: string, isDark: boolean = false): string => {
    if (isDark) {
      switch (level.toLowerCase()) {
        case "debug":
          return "bg-blue-900/30 text-blue-300";
        case "info":
          return "bg-green-900/30 text-green-300";
        case "warn":
          return "bg-yellow-900/30 text-yellow-300";
        case "error":
          return "bg-red-900/30 text-red-300";
        case "critical":
          return "bg-red-900/40 text-red-200";
        default:
          return "bg-gray-900/30 text-gray-300";
      }
    } else {
      switch (level.toLowerCase()) {
        case "debug":
          return "bg-blue-100 text-blue-800";
        case "info":
          return "bg-green-100 text-green-800";
        case "warn":
          return "bg-yellow-100 text-yellow-800";
        case "error":
          return "bg-red-100 text-red-800";
        case "critical":
          return "bg-red-200 text-red-900";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <PageWrapper>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Trivia System Health Dashboard
        </h1>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="games">Game Status</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Overall health of the trivia question system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">System Health</h2>
                  <Button
                    onClick={() => fetchSystemHealth()}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Status
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                    <AlertCircle className="h-5 w-5 inline-block mr-2" />
                    Error checking system health: {error}
                  </div>
                )}

                {healthData && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Database className="h-5 w-5 mr-2 text-gray-500" />
                              <h3 className="font-medium">
                                Database Connection
                              </h3>
                            </div>
                            {healthData.databaseConnection ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                Connected
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />{" "}
                                Disconnected
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-gray-500" />
                              <h3 className="font-medium">Total Questions</h3>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {Object.values(
                                healthData.questionsAvailable,
                              ).reduce((sum, game) => sum + game.count, 0)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 mr-2 text-gray-500" />
                              <h3 className="font-medium">Last Check</h3>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(
                                healthData.timestamp,
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">
                        Game Categories Status:
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        {Object.keys(healthData.questionsAvailable || {}).map(
                          (gameId) => (
                            <Card
                              key={gameId}
                              className={`overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                                selectedGameId === gameId
                                  ? "ring-2 ring-blue-500"
                                  : ""
                              }`}
                              onClick={() => handleGameSelect(gameId)}
                            >
                              <CardHeader className="bg-muted p-4">
                                <CardTitle className="text-lg">
                                  {formatGameName(gameId)}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Database Questions:</span>
                                    <Badge
                                      variant={
                                        healthData.questionsAvailable[gameId]
                                          .count > 0
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {
                                        healthData.questionsAvailable[gameId]
                                          .count
                                      }
                                    </Badge>
                                  </div>

                                  <div className="flex justify-between">
                                    <span>Fallback Available:</span>
                                    <Badge
                                      variant={
                                        healthData.fallbackQuestionsAvailable[
                                          gameId
                                        ]?.available
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {healthData.fallbackQuestionsAvailable[
                                        gameId
                                      ]?.available
                                        ? "Yes"
                                        : "No"}
                                    </Badge>
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(
                                        `/trivia/${gameId}`,
                                        "_blank",
                                      );
                                    }}
                                  >
                                    Test Game
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            {selectedGameId ? (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {formatGameName(selectedGameId)} Details
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGameId(null)}
                    >
                      Back to All Games
                    </Button>
                  </div>
                  <CardDescription>
                    Detailed information about this trivia game
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {healthData &&
                    healthData.questionsAvailable[selectedGameId] && (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg">
                                Database Questions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="mt-2">
                                <div className="text-3xl font-bold">
                                  {
                                    healthData.questionsAvailable[
                                      selectedGameId
                                    ].count
                                  }
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {healthData.questionsAvailable[selectedGameId]
                                    .count > 0
                                    ? "Questions available in database"
                                    : "No questions in database"}
                                </p>
                                {healthData.questionsAvailable[selectedGameId]
                                  .error && (
                                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                                    {
                                      healthData.questionsAvailable[
                                        selectedGameId
                                      ].error
                                    }
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg">
                                Fallback Questions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="mt-2">
                                <div className="text-3xl font-bold">
                                  {healthData.fallbackQuestionsAvailable[
                                    selectedGameId
                                  ]?.count || 0}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {healthData.fallbackQuestionsAvailable[
                                    selectedGameId
                                  ]?.available
                                    ? `Fallback questions from ${healthData.fallbackQuestionsAvailable[selectedGameId]?.source}`
                                    : "No fallback questions available"}
                                </p>
                                {healthData.fallbackQuestionsAvailable[
                                  selectedGameId
                                ]?.error && (
                                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                                    {
                                      healthData.fallbackQuestionsAvailable[
                                        selectedGameId
                                      ]?.error
                                    }
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={() =>
                              window.open(`/trivia/${selectedGameId}`, "_blank")
                            }
                            className="bg-primary hover:bg-primary/90"
                          >
                            Play Game
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => fetchSystemHealth(selectedGameId)}
                          >
                            Refresh Status
                          </Button>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Trivia Games Status</CardTitle>
                  <CardDescription>
                    Select a game to view detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {healthData && (
                    <div className="grid gap-4 md:grid-cols-3">
                      {Object.keys(healthData.questionsAvailable || {}).map(
                        (gameId) => (
                          <Card
                            key={gameId}
                            className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                            onClick={() => handleGameSelect(gameId)}
                          >
                            <CardHeader className="bg-muted p-4">
                              <CardTitle className="text-lg">
                                {formatGameName(gameId)}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Database Questions:</span>
                                  <Badge
                                    variant={
                                      healthData.questionsAvailable[gameId]
                                        .count > 0
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {
                                      healthData.questionsAvailable[gameId]
                                        .count
                                    }
                                  </Badge>
                                </div>

                                <div className="flex justify-between">
                                  <span>Fallback Available:</span>
                                  <Badge
                                    variant={
                                      healthData.fallbackQuestionsAvailable[
                                        gameId
                                      ]?.available
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {healthData.fallbackQuestionsAvailable[
                                      gameId
                                    ]?.available
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </div>

                                <div className="flex justify-between">
                                  <span>Source:</span>
                                  <span className="text-sm text-gray-500">
                                    {healthData.fallbackQuestionsAvailable[
                                      gameId
                                    ]?.source || "N/A"}
                                  </span>
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/trivia/${gameId}`, "_blank");
                                  }}
                                >
                                  Test Game
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>System Logs</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchRecentLogs}
                    disabled={isLoadingLogs}
                  >
                    {isLoadingLogs ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Logs
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Recent system logs related to the trivia system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No logs available</p>
                    </div>
                  ) : (
                    recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 bg-muted border-b">
                          <div className="flex items-center">
                            <Badge
                              className={getLogLevelColor(log.level, false)}
                            >
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="ml-3 font-medium">
                              {log.message}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="text-sm">
                            <strong>Context:</strong>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </div>
                          {log.error_details && (
                            <div className="mt-2 text-sm">
                              <strong>Error:</strong>
                              <pre className="mt-1 p-2 bg-red-50 text-red-700 rounded text-xs overflow-auto">
                                {log.error_details}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageWrapper>
  );
}
