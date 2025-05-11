"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { volunteerAuthService } from "@/lib/volunteer-auth-service"

interface VolunteerLoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function VolunteerLoginForm({ onSuccess, className }: VolunteerLoginFormProps) {
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

    const result = await volunteerAuthService.login(email, password)

    if (result.success) {
      toast({
        title: "Login successful",
        description: "Welcome to the Volunteer Recruiter Dashboard!",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/volunteer-dashboard")
      }
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const handleMagicLinkLogin = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await volunteerAuthService.sendMagicLink(email, `${window.location.origin}/volunteer-dashboard`)

    if (result.success) {
      toast({
        title: "Magic link sent",
        description: "Check your email for a link to sign in",
      })
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div className={className}>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
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
            <Link href="/forgot-password" className="text-sm text-[#0A3C1F] hover:underline">
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
            "Sign In"
          )}
        </Button>

        <div className="relative">
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

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/volunteer-register" className="text-[#0A3C1F] hover:underline font-medium">
              Register as a Volunteer Recruiter
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/resend-confirmation" className="text-[#0A3C1F] hover:underline">
              Resend confirmation email
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
