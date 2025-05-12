"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Upload } from "lucide-react"
import { importDailyBriefings } from "@/app/actions/import-daily-briefings"

export function ImportBriefingsButton() {
  const [csvUrl, setCsvUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    importedCount?: number
    errorCount?: number
    error?: string
  } | null>(null)

  const handleImport = async () => {
    if (!csvUrl) return

    setLoading(true)
    setResult(null)

    try {
      const importResult = await importDailyBriefings(csvUrl)
      setResult(importResult)
    } catch (error) {
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

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Import Successful" : "Import Failed"}</AlertTitle>
            <AlertDescription>
              {result.success
                ? `Successfully imported ${result.importedCount} briefings with ${result.errorCount} errors.`
                : result.error || "An unknown error occurred during import."}
            </AlertDescription>
          </Alert>
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
