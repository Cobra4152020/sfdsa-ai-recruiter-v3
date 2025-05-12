"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { authService } from "@/lib/unified-auth-service"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.signInWithPassword(email, password)

      if (!result.success) {
        throw new Error(result.message)
      }

      // Verify this is an admin account
      if (result.userType !== "admin") {
        throw new Error("This account does not have administrative privileges.")
      }

      toast({
        title: "Admin login successful",
        description: `Welcome back${result.name ? ", " + result.name : ""}!`,
      })

      // Redirect to admin dashboard
      router.push(result.redirectUrl || "/admin/dashboard")
    } catch (error) {
      console.error("Admin login error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkLogin = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.signInWithMagicLink(email, "/admin/dashboard")

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Magic link sent",
        description: "Check your email for a secure login link",
      })
    } catch (error) {
      console.error("Magic link error:", error)
      setError(error instanceof Error ? error.message : "Failed to send magic link")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center mb-6">
        <div className="bg-[#0A3C1F]/10 p-3 rounded-full">
          <Shield className="h-8 w-8 text-[#0A3C1F]" />
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/admin-reset-password" className="text-sm text-[#0A3C1F] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
          <Label htmlFor="remember" className="text-sm">
            Remember me
          </Label>
        </div>

        <Button type="submit" className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⟳</span>
              Signing in...
            </span>
          ) : (
            "Sign In as Administrator"
          )}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10"
        onClick={handleMagicLinkLogin}
        disabled={isLoading}
      >
        Sign in with Magic Link
      </Button>

      <div className="text-center text-sm text-gray-500 mt-6">
        <p>
          Return to{" "}
          <Link href="/" className="text-[#0A3C1F] hover:underline">
            main site
          </Link>
        </p>
      </div>
    </div>
  )
}
