"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface AuthStatusIndicatorProps {
  email: string
}

export function AuthStatusIndicator({ email }: AuthStatusIndicatorProps) {
  const [status, setStatus] = useState<"loading" | "exists" | "not_found" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!email) return

    const checkStatus = async () => {
      try {
        const response = await fetch("/api/admin/auth-diagnostic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          throw new Error("Failed to check auth status")
        }

        const data = await response.json()
        const result = data.result

        if (result.authUserExists || result.userProfileExists) {
          setStatus("exists")

          if (result.discrepancies.length > 0) {
            setMessage(
              "Account found but has some inconsistencies. We'll try to fix these when you resend the confirmation.",
            )
          } else if (result.isEmailConfirmed) {
            setMessage("Your email is already confirmed. You can log in to your account.")
          } else {
            setMessage("Account found. You can resend the confirmation email.")
          }
        } else {
          setStatus("not_found")
          setMessage("No account found with this email address.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Failed to check account status. Please try again.")
      }
    }

    checkStatus()
  }, [email])

  if (!email) return null

  return (
    <div className="mt-4">
      {status === "loading" && (
        <div className="flex items-center justify-center text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Checking account status...</span>
        </div>
      )}

      {status === "exists" && (
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">{message}</AlertDescription>
        </Alert>
      )}

      {status === "not_found" && (
        <Alert className="bg-amber-50 border-amber-200">
          <XCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
