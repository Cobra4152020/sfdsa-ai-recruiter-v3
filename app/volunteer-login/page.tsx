"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { supabase } from "@/lib/supabase-client"
import Link from "next/link"
import { CardFooter } from "@/components/ui/card"

export default function VolunteerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user has volunteer_recruiter role
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single()

      if (rolesError || !userRoles || userRoles.role !== "volunteer_recruiter") {
        await supabase.auth.signOut()
        throw new Error("You do not have permission to access the volunteer recruiter area")
      }

      router.push("/volunteer-dashboard")
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ImprovedHeader />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#0A3C1F] p-3 text-white">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#0A3C1F]">
              Volunteer Recruiter Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the volunteer recruiter dashboard
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A3C1F] sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0A3C1F] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#0A3C1F] hover:text-[#0A3C1F]/80">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have a volunteer account?{" "}
              <Link href="/volunteer-register" className="text-[#0A3C1F] hover:underline font-medium">
                Sign up as a volunteer recruiter
              </Link>
            </div>
            <div className="text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms-of-service" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>

          <div className="text-center text-sm text-gray-500">
            <p>
              Not a volunteer recruiter?{" "}
              <Link href="/login" className="font-medium text-[#0A3C1F] hover:text-[#0A3C1F]/80">
                Return to regular login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
