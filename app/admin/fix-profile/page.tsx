"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fixAdminProfile } from "@/app/actions/fix-admin-profile"
import { useUser } from "@/context/user-context"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function FixAdminProfilePage() {
  const { currentUser } = useUser()
  const [userId, setUserId] = useState(currentUser?.id || "")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFix = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const result = await fixAdminProfile(userId)
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
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
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              Your User ID
            </label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {currentUser ? "Your current user ID has been pre-filled." : "Please enter your user ID."}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFix} disabled={!userId || isLoading} className="w-full">
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
              const { supabase } = await import("@/lib/supabase-client-singleton")
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
