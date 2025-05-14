"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Facebook, Twitter, Linkedin, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

interface UnifiedApplyPopupProps {
  isOpen: boolean
  onClose: () => void
  requiredPoints?: number
  actionName?: string
  redirectUrl?: string
  userType?: "recruit" | "volunteer" | "admin"
}

export default function UnifiedApplyPopup({
  isOpen,
  onClose,
  requiredPoints = 0,
  actionName = "continue",
  redirectUrl,
  userType = "recruit",
}: UnifiedApplyPopupProps) {
  const [activeTab, setActiveTab] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Reset form when tab changes
  useEffect(() => {
    setError("")
    setIsLoading(false)
  }, [activeTab])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!isOpen) return null

  const triggerConfetti = () => {
    const duration = 2000
    const end = Date.now() + duration

    const colors = ["#FFC700", "#FF0000", "#2E86C1", "#58D68D", "#C39BD3"]
    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      triggerConfetti()
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })

      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.refresh()
      }
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      })

      if (authError) throw authError

      // Create user profile in the appropriate table based on user type
      const { error: profileError } = await supabase
        .from(userType === "volunteer" ? "volunteer_users" : userType === "admin" ? "admin_users" : "recruit_users")
        .insert({
          user_id: authData.user?.id,
          email,
          full_name: fullName,
          created_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Award 50 points to new user
      if (userType === "recruit") {
        const { error: pointsError } = await supabase.from("user_points").insert({
          user_id: authData.user?.id,
          points: 50,
          reason: "Welcome bonus",
          created_at: new Date().toISOString(),
        })

        if (pointsError) console.error("Failed to award points:", pointsError)
      }

      triggerConfetti()
      toast({
        title: "Welcome to SF Deputy Sheriff's Association!",
        description: "Your account has been created successfully.",
      })

      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.refresh()
      }
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "facebook" | "twitter" | "apple" | "linkedin") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?user_type=${userType}`,
          queryParams: {
            user_type: userType,
          },
        },
      })

      if (error) throw error
    } catch (err: any) {
      toast({
        title: "Authentication Error",
        description: err.message || "Failed to authenticate with social provider",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-md p-6 overflow-hidden bg-white shadow-xl rounded-xl">
        <button
          onClick={onClose}
          className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{activeTab === "signin" ? "Sign In" : "Create Account"}</h2>
          {requiredPoints > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              You need {requiredPoints} points to {actionName}. Sign in or create an account to continue.
            </p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="text-sm text-right">
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <a href="/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {error && <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("facebook")}
            className="flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("twitter")}
            className="flex items-center justify-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("linkedin")}
            className="flex items-center justify-center gap-2 text-blue-700 border-blue-700 hover:bg-blue-50"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSocialSignIn("apple")}
            className="flex items-center justify-center gap-2 text-gray-800 border-gray-800 hover:bg-gray-50"
          >
            <Apple className="w-5 h-5" />
            <span>Apple</span>
          </Button>
        </div>

        {userType === "recruit" && (
          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you'll receive 50 points as a welcome bonus!
          </p>
        )}

        {userType === "volunteer" && (
          <p className="mt-6 text-xs text-center text-gray-500">
            Signing up as a Volunteer Recruiter? Your account will need approval before you can access all features.
          </p>
        )}
      </Card>
    </div>
  )
}
