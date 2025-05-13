"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Mail, Lock, User, Facebook, Twitter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { authService } from "@/lib/unified-auth-service"
import { useUser } from "@/context/user-context"
import { v4 as uuidv4 } from "uuid"

interface UnifiedRegistrationPopupProps {
  isOpen: boolean
  onClose: () => void
  isApplying?: boolean
  referralCode?: string
  requiredPoints?: number
  actionName?: string
}

export function UnifiedRegistrationPopup({
  isOpen,
  onClose,
  isApplying = false,
  referralCode,
  requiredPoints,
  actionName,
}: UnifiedRegistrationPopupProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "optin">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [referralSource, setReferralSource] = useState("website")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const { toast } = useToast()
  const { login } = useUser()

  // Generate a unique tracking number for opt-in
  useEffect(() => {
    if (activeTab === "optin") {
      const prefix = referralCode ? "SFDSA-REF" : "SFDSA-DIR"
      const randomPart = uuidv4().substring(0, 6).toUpperCase()
      setTrackingNumber(`${prefix}-${randomPart}`)
    }
  }, [activeTab, referralCode])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (resetPassword) {
        const result = await authService.resetPassword(email)

        toast({
          title: result.success ? "Password reset email sent" : "Error",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        })

        setResetPassword(false)
        setIsLoading(false)
        return
      }

      const result = await authService.signInWithPassword(email, password)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      })

      // Login the user in the context
      if (result.userId) {
        login({
          id: result.userId,
          name: result.name || email.split("@")[0] || "User",
          email: result.email || email,
          participation_count: 0,
          has_applied: false,
        })
      }

      onClose()
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
      // Validate inputs
      if (!name.trim()) {
        throw new Error("Please enter your name")
      }

      const result = await authService.registerRecruit(email, password, name)

      if (!result.success) {
        throw new Error(result.message || "Failed to create account")
      }

      toast({
        title: "Sign up successful",
        description: "Your account has been created with 50 points!",
      })

      // Login the user in the context
      if (result.userId) {
        login({
          id: result.userId,
          name: result.name || name,
          email: result.email || email,
          participation_count: 50, // Initial points
          has_applied: false,
        })
      }

      onClose()
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
      // Save to database
      const { supabase } = await import("@/lib/supabase-service")
      const { error } = await supabase.from("applicants").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        zip_code: zipCode,
        referral_source: referralSource,
        referral_code: referralCode || null,
        tracking_number: trackingNumber,
        application_status: isApplying ? "started" : "interested",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error submitting form:", error)
        toast({
          title: "Submission Error",
          description: "There was a problem submitting your information. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Show success message
      setIsSubmitted(true)

      // Redirect after showing success message
      setTimeout(() => {
        if (isApplying) {
          window.location.href = "https://careers.sf.gov/interest/public-safety/sheriff/"
        } else {
          onClose()
        }
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "facebook" | "twitter" | "google") => {
    setSocialLoading(provider)

    try {
      const result = await authService.signInWithSocialProvider(provider)

      if (!result.success) {
        throw new Error(result.message)
      }

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error)
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  const renderPointsMessage = () => {
    if (!requiredPoints) return null

    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md mb-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {actionName ? `The "${actionName}" action` : "This action"} requires {requiredPoints} points. Sign in or
          create an account to continue. New users receive 50 points upon registration!
        </p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                {activeTab === "optin"
                  ? isApplying
                    ? "Start Your Deputy Sheriff Application"
                    : "Sign up for Recruitment Updates"
                  : activeTab === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {activeTab === "optin"
                  ? isApplying
                    ? "Take the first step toward a rewarding career with the San Francisco Sheriff's Office."
                    : "Get the latest information about the SF Deputy Sheriff recruitment process, events, and opportunities."
                  : activeTab === "signin"
                    ? "Sign in to your account to continue"
                    : "Create a new account to get started"}
              </DialogDescription>
            </DialogHeader>

            {renderPointsMessage()}

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup" | "optin")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="optin">Opt-In</TabsTrigger>
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
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {!resetPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!resetPassword}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember"
                              checked={rememberMe}
                              onCheckedChange={(checked) => setRememberMe(!!checked)}
                            />
                            <Label htmlFor="remember" className="text-sm">
                              Remember me
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            className="text-sm text-[#0A3C1F]"
                            onClick={() => setResetPassword(true)}
                          >
                            Forgot password?
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {resetPassword && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4"
                    >
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setResetPassword(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Send Reset Link
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : resetPassword ? "Send Reset Link" : "Sign In"}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("google")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center"
                      >
                        {socialLoading === "google" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        )}
                        <span className="sr-only">Google</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("facebook")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center text-[#1877F2]"
                      >
                        {socialLoading === "facebook" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Facebook className="h-4 w-4" />
                        )}
                        <span className="sr-only">Facebook</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("twitter")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center text-[#1DA1F2]"
                      >
                        {socialLoading === "twitter" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Twitter className="h-4 w-4" />
                        )}
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </div>
                  </div>
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
                        placeholder="John Doe"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      required
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <a href="/terms-of-service" className="text-[#0A3C1F] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" className="text-[#0A3C1F] hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    disabled={isLoading || !agreeToTerms}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("google")}
                      disabled={!!socialLoading}
                      className="flex items-center justify-center"
                    >
                      {socialLoading === "google" ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      )}
                      <span className="sr-only">Google</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("facebook")}
                      disabled={!!socialLoading}
                      className="flex items-center justify-center text-[#1877F2]"
                    >
                      {socialLoading === "facebook" ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        <Facebook className="h-4 w-4" />
                      )}
                      <span className="sr-only">Facebook</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("twitter")}
                      disabled={!!socialLoading}
                      className="flex items-center justify-center text-[#1DA1F2]"
                    >
                      {socialLoading === "twitter" ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        <Twitter className="h-4 w-4" />
                      )}
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="optin">
                <form onSubmit={handleOptIn} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        required
                        className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        required
                        className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-optin">Email</Label>
                    <Input
                      id="email-optin"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(415) 555-1234"
                      className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="94102"
                      className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="optin-terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                      required
                    />
                    <Label htmlFor="optin-terms" className="text-sm">
                      I agree to receive communications about the San Francisco Sheriff's Office recruitment process.
                    </Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !agreeToTerms}
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    >
                      {isLoading ? "Submitting..." : isApplying ? "Start Application" : "Sign Up"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {activeTab === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 text-[#0A3C1F]" onClick={() => setActiveTab("signup")}>
                    Sign up
                  </Button>
                </p>
              ) : activeTab === "signup" ? (
                <p>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 text-[#0A3C1F]" onClick={() => setActiveTab("signin")}>
                    Sign in
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 text-[#0A3C1F]" onClick={() => setActiveTab("signin")}>
                    Sign in
                  </Button>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {isApplying
                ? "Your application has been initiated. You'll be redirected to the official application page."
                : "You've been added to our recruitment updates list."}
            </p>
            {trackingNumber && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Your tracking number:</p>
                <p className="font-mono font-bold text-[#0A3C1F] dark:text-[#FFD700]">{trackingNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Please save this number for future reference
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
