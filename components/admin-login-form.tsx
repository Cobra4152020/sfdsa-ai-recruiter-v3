"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/lib/supabase-client-singleton"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: signInError.message,
        })
        return
      }

      if (!data.user) {
        setError("Login failed. Please try again.")
        return
      }

      // Check if the user has admin role
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .single()

      if (userTypeError) {
        setError("Failed to verify your access level.")
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: "Could not verify your admin status.",
        })
        return
      }

      if (!userTypeData || userTypeData.user_type !== "admin") {
        setError("You do not have admin privileges.")
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Your account does not have admin privileges.",
        })

        // Sign out since this is not an admin
        await supabase.auth.signOut()
        return
      }

      // Log the admin login
      await supabase.from("login_audit_logs").insert({
        user_id: data.user.id,
        event_type: "admin_login",
        details: {
          email: data.user.email,
          method: "password",
        },
        created_at: new Date().toISOString(),
      })

      // Record login metrics
      await supabase.from("login_metrics").insert({
        user_role: "admin",
        login_method: "password",
        success: true,
        created_at: new Date().toISOString(),
      })

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      })

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
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
    <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#0A3C1F]">Admin Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access the admin area</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center">
                Login to Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
