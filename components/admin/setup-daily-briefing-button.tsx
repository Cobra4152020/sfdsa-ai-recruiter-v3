"use client"

import { useState } from "react"
import { setupDailyBriefingSystem } from "@/app/actions/setup-daily-briefing-system"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Check, Clock } from "lucide-react"

export function SetupDailyBriefingButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<null | { success: boolean; message: string; alreadyExists?: boolean }>(null)
  const { toast } = useToast()

  const handleSetup = async () => {
    try {
      setLoading(true)
      setStatus(null)

      const result = await setupDailyBriefingSystem()

      setStatus(result)

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error setting up briefing system:", error)

      setStatus({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })

      toast({
        title: "Error",
        description: "Failed to set up the daily briefing system",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleSetup} disabled={loading} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
        {loading ? (
          <>
            <Clock className="mr-2 h-4 w-4 animate-spin" />
            Setting Up...
          </>
        ) : status?.success ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            {status.alreadyExists ? "Already Set Up" : "Setup Complete"}
          </>
        ) : (
          <>
            {status?.success === false ? <AlertCircle className="mr-2 h-4 w-4" /> : null}
            Setup Daily Briefing System
          </>
        )}
      </Button>

      {status && (
        <p className={`mt-2 text-sm ${status.success ? "text-green-600" : "text-red-600"}`}>{status.message}</p>
      )}
    </div>
  )
}
