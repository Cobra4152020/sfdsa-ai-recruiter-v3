"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/context/user-context"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowOrigin } from "@/lib/utils"

interface UnifiedRegistrationPopupProps {
  isOpen: boolean
  onClose: () => void
  isApplying?: boolean
  referralCode?: string
  requiredPoints?: number
  actionName?: string
  initialTab?: "signin" | "signup" | "optin"
  userType?: "recruit" | "volunteer" | "admin"
  callbackUrl?: string
  title?: string
  description?: string
}

export function UnifiedRegistrationPopup({
  isOpen,
  onClose,
  isApplying = false,
  referralCode,
  requiredPoints,
  actionName,
  initialTab = "signin",
  userType = "recruit",
  callbackUrl,
  title,
  description,
}: UnifiedRegistrationPopupProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "optin">(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { toast } = useToast()
  const { login } = useUser()
  const router = useRouter()
  const memoizedGetWindowOrigin = useCallback(() => getWindowOrigin(), [])
  const origin = useClientOnly(memoizedGetWindowOrigin, '')

  // Generate a unique tracking number for opt-in
  useEffect(() => {
    if (activeTab === "optin") {
      const prefix = referralCode ? "SFDSA-REF" : "SFDSA-DIR"
      const randomPart = uuidv4().substring(0, 6).toUpperCase()
      setTrackingNumber(`${prefix}-${randomPart}`)
    }
  }, [activeTab, referralCode])

  // Set initial tab
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (resetPassword) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for a link to reset your password",
        })
        setResetPassword(false)
        setIsLoading(false)
        return
      }

      // For demo purposes, create a mock user
      const mockUser = {
        id: "demo-user-id",
        email: email,
        name: email.split("@")[0],
        userType: userType,
        participation_count: 0,
        has_applied: false,
      }

      login(mockUser)

      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      })

      // Redirect based on user type
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (userType === "volunteer") {
        router.push("/volunteer-dashboard")
      } else if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }

      onClose()
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!agreeToTerms) {
        throw new Error("Please agree to the terms and conditions")
      }

      // For demo purposes, create a mock user
      const mockUser = {
        id: "demo-user-id",
        email: email,
        name: name || email.split("@")[0],
        userType: userType,
        participation_count: 0,
        has_applied: false,
      }

      login(mockUser)

      toast({
        title: "Sign up successful",
        description: "Welcome to SFDSA!",
      })

      // Redirect based on user type
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (userType === "volunteer") {
        router.push("/volunteer-dashboard")
      } else if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }

      onClose()
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!agreeToTerms) {
        throw new Error("Please agree to the terms and conditions")
      }

      // For demo purposes, create a mock user
      const mockUser = {
        id: "demo-user-id",
        email: email,
        name: name || email.split("@")[0],
        userType: userType,
        participation_count: 0,
        has_applied: false,
      }

      login(mockUser)

      toast({
        title: "Opt-in successful",
        description: "Welcome to SFDSA!",
      })

      // Redirect based on user type
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (userType === "volunteer") {
        router.push("/volunteer-dashboard")
      } else if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }

      onClose()
    } catch (error) {
      console.error("Opt-in error:", error)
      toast({
        title: "Opt-in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderPointsMessage = () => {
    if (!requiredPoints || !actionName) return null
    return (
      <div className="text-sm text-muted-foreground mb-4">
        This action requires {requiredPoints} points. {actionName}
      </div>
    )
  }

  const getDialogTitle = () => {
    if (title) return title
    if (isApplying) return "Apply to Join SFDSA"
    if (activeTab === "optin") return "Opt-in to SFDSA"
    if (activeTab === "signup") return "Create an Account"
    return "Sign In"
  }

  const getDialogDescription = () => {
    if (description) return description
    if (isApplying) return "Complete your application to join the San Francisco Deputy Sheriff's Department"
    if (activeTab === "optin") return "Join our community and stay updated with the latest opportunities"
    if (activeTab === "signup") return "Create your account to access all features"
    return "Sign in to your account to continue"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {renderPointsMessage()}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="optin">Opt In</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {!resetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setResetPassword(!resetPassword)}
                  className="text-sm text-primary hover:underline"
                >
                  {resetPassword ? "Back to sign in" : "Forgot password?"}
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : resetPassword ? "Send reset link" : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign up"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="optin">
            <form onSubmit={handleOptIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="optin-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="optin-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="optin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="optin-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  required
                />
                <Label htmlFor="optin-terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Opt in"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
