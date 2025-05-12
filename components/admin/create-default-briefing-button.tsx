"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Plus } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

export function CreateDefaultBriefingButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)
  const router = useRouter()

  const handleCreate = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Create a default briefing for today
      const supabase = createBrowserClient()

      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("daily_briefings")
        .insert({
          date: today,
          theme: "duty",
          quote:
            "The ultimate measure of a person is not where they stand in moments of comfort and convenience, but where they stand in times of challenge and controversy.",
          quote_author: "Martin Luther King Jr.",
          sgt_ken_take:
            "As deputy sheriffs, we face challenges daily that test our character and resolve. It's easy to do the right thing when everything is going well, but our true measure as law enforcement professionals is how we respond under pressure. Remember that each difficult situation is an opportunity to demonstrate our commitment to duty and service.",
          call_to_action:
            "Today, reflect on a challenging situation you've faced recently. How did you respond? What would you do differently next time? Share your insights with a colleague.",
          created_at: new Date().toISOString(),
          active: true,
        })
        .select()

      if (error) {
        throw error
      }

      setResult({
        success: true,
        message: "Default briefing created successfully.",
      })

      // Refresh the page to show the new briefing
      router.refresh()
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
        <CardTitle>Create Default Briefing</CardTitle>
        <CardDescription>Create a default briefing for today if none exists.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.success
                ? result.message || "Default briefing created successfully."
                : result.error || "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreate} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Default Briefing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
