"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { fixAdminProfile } from "@/lib/actions/fix-admin-profile"
import Link from "next/link"
import { getClientSideSupabase } from "@/lib/supabase"

export default function FixAdminProfilePage() {
  const [email, setEmail] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = getClientSideSupabase()

  const handleFix = async () => {
    if (!email || !recoveryCode) {
      setError("Email and recovery code are required")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await fixAdminProfile({ email, recoveryCode })

      if (result.success) {
        setSuccess(result.message)
        if (result.userId) {
          setUserId(result.userId)
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Fix Admin Profile</CardTitle>
          <CardDescription>
            This tool will fix issues with your admin user profile that might be causing login problems.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="recoveryCode" className="text-sm font-medium">
              Recovery Code
            </label>
            <Input
              id="recoveryCode"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              placeholder="Enter your recovery code"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFix} disabled={!email || !recoveryCode || isLoading} className="w-full">
            {isLoading ? "Fixing..." : "Fix My Profile"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>After fixing your profile, try logging out and logging back in.</p>
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = "/login"
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
