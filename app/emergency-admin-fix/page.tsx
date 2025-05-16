"use client"

import { useState } from "react"
import { publicFixAdminAlt } from "@/lib/actions/public-fix-admin-alt"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, LockKeyhole, Shield } from "lucide-react"

export default function EmergencyAdminFixPage() {
  const [userId, setUserId] = useState("")
  const [email, setEmail] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; userId?: string; email?: string } | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)

  const handleFix = async () => {
    if (!userId || !email || !securityCode) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await publicFixAdminAlt({ userId, email, securityCode })
      setResult(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Direct SQL execution alternative for Supabase client issues
  const handleManualFix = async () => {
    // Implementation removed - using the main fix instead
  }

  return (
    <div className="container max-w-md py-10">
      <Card className="border-amber-500 border-2">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Shield className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-center">Emergency Admin Fix</CardTitle>
          <CardDescription className="text-center">
            Use this tool to fix admin profile issues without requiring authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
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
            <label htmlFor="userId" className="text-sm font-medium">
              Admin User ID
            </label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">The UUID of your admin user account.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Admin Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">This must match the email used for your admin account.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="securityCode" className="text-sm font-medium">
              Security Code
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="securityCode"
                type="password"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Enter security code"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the emergency security code. Default: <code>sfdsa-emergency-admin-fix</code>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleFix}
            disabled={!userId || !email || !securityCode || isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? "Fixing..." : "Fix Admin Profile"}
          </Button>
        </CardFooter>
      </Card>

      {result?.success && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-medium mb-2">Profile fixed successfully!</p>
          <Button variant="outline" onClick={() => (window.location.href = "/admin-login")} className="mr-2">
            Go to Admin Login
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setUserId("")
              setEmail("")
              setSecurityCode("")
              setResult(null)
              setError(null)
            }}
          >
            Reset Form
          </Button>
        </div>
      )}
    </div>
  )
}
