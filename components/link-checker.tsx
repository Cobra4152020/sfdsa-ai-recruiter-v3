"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { checkAllLinks, type LinkCheckResult } from "@/lib/link-checker"
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react"

export function LinkChecker() {
  const [results, setResults] = useState<LinkCheckResult[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckLinks = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const linkResults = await checkAllLinks()
      setResults(linkResults)
    } catch (err) {
      console.error("Error checking links:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Automatically check links when component mounts
    handleCheckLinks()
  }, [])

  const validLinks = results.filter((result) => result.ok)
  const brokenLinks = results.filter((result) => !result.ok)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Link Checker</CardTitle>
            <CardDescription>Check for broken links in the application</CardDescription>
          </div>
          <Button onClick={handleCheckLinks} disabled={isChecking} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Check Links"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <p className="font-medium">Error checking links:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Valid: {validLinks.length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Broken: {brokenLinks.length}
          </Badge>
          <Badge variant="outline">Total: {results.length}</Badge>
        </div>

        {isChecking ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {brokenLinks.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-red-600 mb-2">Broken Links</h3>
                {brokenLinks.map((result, index) => (
                  <div key={index} className="p-3 mb-2 rounded-lg border border-red-200 bg-red-50 flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{result.url}</div>
                      <div className="text-sm text-red-600">
                        Status: {result.status} - {result.message}
                      </div>
                      {result.source && <div className="text-xs text-gray-500 mt-1">Source: {result.source}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {validLinks.length > 0 && (
              <div>
                <h3 className="font-medium text-green-600 mb-2">Valid Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {validLinks.map((result, index) => (
                    <div key={index} className="p-3 rounded-lg border border-green-200 bg-green-50 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{result.url}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          {result.url.startsWith("http") && !result.url.includes(window.location.hostname) ? (
                            <ExternalLink className="h-3 w-3 mr-1" />
                          ) : null}
                          {result.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && <div className="text-center py-8 text-gray-500">No links checked yet</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
