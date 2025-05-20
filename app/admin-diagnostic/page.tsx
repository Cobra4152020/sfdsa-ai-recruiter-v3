"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { getClientSideSupabase } from "@/lib/supabase"

export default function AdminDiagnosticPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [userType, setUserType] = useState<any>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<any>(null)

  const runDiagnostic = async () => {
    const supabase = getClientSideSupabase()
    if (!email) {
      setError("Email is required")
      return
    }

    setIsLoading(true)
    setError(null)
    setAuthUser(null)
    setUserType(null)
    setAdminUser(null)
    setUserRole(null)

    try {
      // Check auth user
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (authError) {
        if (authError.message.includes("User not found")) {
          setAuthUser({ exists: false, message: "User does not exist in Auth" })
        } else {
          setAuthUser({ exists: false, message: authError.message })
        }
      } else {
        setAuthUser({ exists: true, message: "Magic link sent. User exists in Auth." })
      }

      // Check user_types
      const { data: typeData, error: typeError } = await supabase
        .from("user_types")
        .select("*")
        .eq("email", email)
        .maybeSingle()

      if (typeError) {
        setUserType({ exists: false, message: typeError.message })
      } else if (!typeData) {
        setUserType({ exists: false, message: "No entry in user_types table" })
      } else {
        setUserType({ exists: true, data: typeData })

        // If we have a user_id, check admin.users
        if (typeData.user_id) {
          const { data: adminData, error: adminError } = await supabase
            .from("admin.users")
            .select("*")
            .eq("id", typeData.user_id)
            .maybeSingle()

          if (adminError) {
            if (adminError.message.includes("does not exist")) {
              setAdminUser({ exists: false, message: "admin.users table does not exist" })
            } else {
              setAdminUser({ exists: false, message: adminError.message })
            }
          } else if (!adminData) {
            setAdminUser({ exists: false, message: "No entry in admin.users table" })
          } else {
            setAdminUser({ exists: true, data: adminData })
          }

          // Check user_roles
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", typeData.user_id)
            .eq("role", "admin")
            .maybeSingle()

          if (roleError) {
            if (roleError.message.includes("does not exist")) {
              setUserRole({ exists: false, message: "user_roles table does not exist" })
            } else {
              setUserRole({ exists: false, message: roleError.message })
            }
          } else if (!roleData) {
            setUserRole({ exists: false, message: "No admin role entry in user_roles table" })
          } else {
            setUserRole({ exists: true, data: roleData })
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#0A3C1F] mb-6 text-center">Admin Account Diagnostic</h1>

      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle>Check Admin Account Status</CardTitle>
          <CardDescription>This tool will check the status of your admin account in the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runDiagnostic} className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⟳</span>
                Checking...
              </span>
            ) : (
              "Check Account Status"
            )}
          </Button>
        </CardFooter>
      </Card>

      {(authUser || userType || adminUser || userRole) && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {authUser && (
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  {authUser.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="font-medium">Auth Status</h3>
                </div>
                <p className="text-sm text-gray-600">{authUser.message}</p>
              </div>
            )}

            {userType && (
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  {userType.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="font-medium">User Type</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {userType.exists
                    ? `Type: ${userType.data.user_type}, User ID: ${userType.data.user_id}`
                    : userType.message}
                </p>
              </div>
            )}

            {adminUser && (
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  {adminUser.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="font-medium">Admin User</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {adminUser.exists
                    ? `Name: ${adminUser.data.name}, Email: ${adminUser.data.email}`
                    : adminUser.message}
                </p>
              </div>
            )}

            {userRole && (
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  {userRole.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <h3 className="font-medium">Admin Role</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {userRole.exists
                    ? `Role: ${userRole.data.role}, Active: ${userRole.data.is_active ? "Yes" : "No"}`
                    : userRole.message}
                </p>
              </div>
            )}

            {authUser && userType && adminUser && userRole && (
              <Alert
                className={
                  authUser.exists && userType.exists && adminUser.exists && userRole.exists
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }
              >
                <AlertTitle
                  className={
                    authUser.exists && userType.exists && adminUser.exists && userRole.exists
                      ? "text-green-800"
                      : "text-amber-800"
                  }
                >
                  {authUser.exists && userType.exists && adminUser.exists && userRole.exists
                    ? "All checks passed"
                    : "Some checks failed"}
                </AlertTitle>
                <AlertDescription
                  className={
                    authUser.exists && userType.exists && adminUser.exists && userRole.exists
                      ? "text-green-700"
                      : "text-amber-700"
                  }
                >
                  {authUser.exists && userType.exists && adminUser.exists && userRole.exists
                    ? "Your admin account appears to be properly set up. You should be able to log in."
                    : "Your admin account has issues. Use the Admin Recovery tool to fix them."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
