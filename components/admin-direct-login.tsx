"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Shield, ArrowRight, Loader2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/lib/supabase-client-singleton" // Use the singleton

export function AdminDirectLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleAdminAccess = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Checking admin access...")

      // Get the current session using the singleton client
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        setError("Failed to verify your session. Please try again.")
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: sessionError.message,
        })
        return
      }

      if (!sessionData.session) {
        console.log("No active session found")
        setError("You need to be logged in as an admin to access this area.")
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Please log in with admin credentials first.",
        })

        // Redirect to a login page that has username/password fields
        router.push("/admin/login")
        return
      }

      console.log("Session found, checking user type...")

      // Check if the user has admin role
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", sessionData.session.user.id)
        .single()

      if (userTypeError) {
        console.error("User type error:", userTypeError)
        setError("Failed to verify your access level.")
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: "Could not verify your admin status.",
        })
        return
      }

      if (!userTypeData || userTypeData.user_type !== "admin") {
        console.log("User is not an admin:", userTypeData?.user_type)
        setError("You do not have admin privileges.")
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Your account does not have admin privileges.",
        })
        return
      }

      console.log("Admin access verified, logging access...")

      // Log the admin access
      const { error: logError } = await supabase.from("login_audit_logs").insert({
        user_id: sessionData.session.user.id,
        event_type: "admin_direct_access",
        details: {
          email: sessionData.session.user.email,
          method: "direct_access",
        },
        created_at: new Date().toISOString(),
      })

      if (logError) {
        console.error("Error logging admin access:", logError)
        // Continue anyway, this is not critical
      }

      console.log("Redirecting to admin dashboard...")

      toast({
        title: "Admin access granted",
        description: "Welcome to the admin dashboard",
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Admin access error:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-t-4 border-t-primary shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Admin Access</CardTitle>
        <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/10 p-6 rounded-full">
          <Shield className="h-12 w-12 text-primary" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <p>This access is for authorized administrators only.</p>
          <p>If you need assistance, please contact the system administrator.</p>
        </div>
      </CardContent>
    </Card>
  )
}
