"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SetupDailyBriefingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [addingBriefing, setAddingBriefing] = useState(false)
  const [briefingResult, setBriefingResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupTable = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/setup-daily-briefings", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error setting up daily briefings table:", error)
      setResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const addBriefing = async () => {
    setAddingBriefing(true)
    setBriefingResult(null)

    try {
      const response = await fetch("/api/admin/add-sample-briefing", {
        method: "POST",
      })

      const data = await response.json()
      setBriefingResult(data)
    } catch (error) {
      console.error("Error adding sample briefing:", error)
      setBriefingResult({ success: false, message: "An unexpected error occurred" })
    } finally {
      setAddingBriefing(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Setup Daily Briefings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Initialize Daily Briefings Table</CardTitle>
            <CardDescription>Create the daily_briefings table in your database if it doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This will check if the daily_briefings table exists in your database. If it doesn't, it will create the
              table with the necessary structure and RLS policies.
            </p>

            {result && (
              <Alert variant={result.success ? "success" : "destructive"} className="mt-4">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={setupTable} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Setting up..." : "Setup Daily Briefings Table"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Sample Briefing</CardTitle>
            <CardDescription>Add a sample briefing for today if one doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This will add a sample briefing for today's date if one doesn't already exist.
            </p>

            {briefingResult && (
              <Alert variant={briefingResult.success ? "success" : "destructive"} className="mt-4">
                {briefingResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{briefingResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{briefingResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={addBriefing} disabled={addingBriefing}>
              {addingBriefing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {addingBriefing ? "Adding..." : "Add Sample Briefing"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
