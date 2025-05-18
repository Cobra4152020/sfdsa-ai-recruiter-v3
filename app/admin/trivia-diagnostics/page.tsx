"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export default function TriviaDiagnosticsPage() {
  const [diagnosticResults, setDiagnosticResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/trivia/diagnostics")

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticResults(data)
    } catch (err) {
      console.error("Error running trivia diagnostics:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Trivia System Diagnostics</CardTitle>
          <CardDescription>Check the status of the trivia question system and troubleshoot issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">System Status</h2>
            <Button onClick={() => runDiagnostics()} disabled={isLoading} variant="outline">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              Error running diagnostics: {error}
            </div>
          )}

          {diagnosticResults && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Database Connection:</p>
                </div>
                <div>
                  {diagnosticResults.databaseConnection ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-4 w-4 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="h-4 w-4 mr-1" /> Disconnected
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Trivia Games Status:</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.keys(diagnosticResults.questionsAvailable || {}).map((gameId) => (
                    <Card key={gameId} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 p-4">
                        <CardTitle className="text-lg">{formatGameName(gameId)}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Database Questions:</span>
                            <Badge
                              variant={
                                diagnosticResults.questionsAvailable[gameId].count > 0 ? "outline" : "destructive"
                              }
                            >
                              {diagnosticResults.questionsAvailable[gameId].count}
                            </Badge>
                          </div>

                          <div className="flex justify-between">
                            <span>Fallback Available:</span>
                            <Badge
                              variant={
                                diagnosticResults.fallbackQuestionsAvailable[gameId]?.available
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {diagnosticResults.fallbackQuestionsAvailable[gameId]?.available ? "Yes" : "No"}
                            </Badge>
                          </div>

                          <div className="flex justify-between">
                            <span>Source:</span>
                            <span className="text-sm text-gray-500">
                              {diagnosticResults.fallbackQuestionsAvailable[gameId]?.source || "N/A"}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => window.open(`/trivia/${gameId}`, "_blank")}
                          >
                            Test Game
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function formatGameName(gameId) {
  return gameId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
