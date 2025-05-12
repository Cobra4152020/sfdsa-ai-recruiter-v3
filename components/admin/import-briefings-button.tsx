"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Upload } from "lucide-react"
import { importDailyBriefings } from "@/app/actions/import-daily-briefings"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

export function ImportBriefingsButton() {
  const [csvUrl, setCsvUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    importedCount?: number
    errorCount?: number
    error?: string
    details?: string[]
  } | null>(null)

  const handleImport = async () => {
    if (!csvUrl) return

    setLoading(true)
    setResult(null)
    setProgress(10) // Start progress

    try {
      // Simulate progress while waiting for import
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 5
        })
      }, 1000)

      const importResult = await importDailyBriefings(csvUrl)

      clearInterval(progressInterval)
      setProgress(100) // Complete progress
      setResult(importResult)
    } catch (error) {
      setProgress(100)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Import Daily Briefings</CardTitle>
        <CardDescription>
          Import Sgt. Ken's Daily Briefings from a CSV file. The CSV should have columns for date, quote, author,
          sgt_ken_take, and call_to_action.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="csvUrl" className="text-sm font-medium">
            CSV URL
          </label>
          <Input
            id="csvUrl"
            placeholder="https://example.com/briefings.csv"
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
          />
        </div>

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Importing briefings...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Import Successful" : "Import Failed"}</AlertTitle>
              <AlertDescription>
                {result.success
                  ? `Successfully imported ${result.importedCount} briefings with ${result.errorCount} errors.`
                  : result.error || "An unknown error occurred during import."}
              </AlertDescription>
            </Alert>

            {result.details && result.details.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="errors">
                  <AccordionTrigger className="text-sm font-medium">
                    View Error Details ({result.details.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="max-h-60 overflow-y-auto text-sm text-gray-700 space-y-1 p-2 bg-gray-50 rounded-md">
                      {result.details.map((detail, index) => (
                        <div key={index} className="border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleImport} disabled={loading || !csvUrl} className="flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Import Briefings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
