"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-clients"
import { Spinner } from "@/components/ui/spinner"

interface AdminLoginFormProps {
  redirectTo?: string
}

export function AdminLoginForm({ redirectTo = "/admin/dashboard" }: AdminLoginFormProps) {
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
      const supabase = createClient()

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        toast({
          variant: "destructive",
          title: "Login failed",
          description: signInError.message,
        })
        return
      }

      if (!data.user) {
        setError("No user returned from authentication")
        return
      }

      // Check if user has admin role
      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .single()

      if (userTypeError) {
        setError("Failed to verify admin status")
        return
      }

      if (!userTypeData || userTypeData.user_type !== "admin") {
        setError("You do not have admin privileges")
        await supabase.auth.signOut()
        return
      }

      // Log the successful login
      await supabase.from("login_audit_logs").insert({
        user_id: data.user.id,
        event_type: "admin_login",
        details: {
          email: data.user.email,
          method: "password",
        },
        created_at: new Date().toISOString(),
      })

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      })

      router.push(redirectTo)
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          required
          placeholder="admin@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <Spinner size="sm" className="mr-2" />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  )
}
