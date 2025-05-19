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
import { Eye, EyeOff, Mail, Lock, User, Facebook, Twitter, Apple } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/context/user-context"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowOrigin, isBrowser } from "@/lib/utils"
import { getClientSideSupabase } from "@/lib/supabase"

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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [organization, setOrganization] = useState("")
  const [position, setPosition] = useState("")
  const [location, setLocation] = useState("")
  const [referralSource, setReferralSource] = useState("website")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const { toast } = useToast()
  const { login } = useUser()
  const router = useRouter()
  const origin = useClientOnly(() => getWindowOrigin(), '')

  const supabase = getClientSideSupabase()

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
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/reset-password`,
        })

        if (error) throw error

        toast({
          title: "Password reset email sent",
          description: "Check your email for a link to reset your password",
        })

        setResetPassword(false)
        setIsLoading(false)
        return
      }

      // Use the appropriate auth service based on user type
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Get user profile data
        let userData

        // Check user type based on the tables
        if (userType === "volunteer") {
          const { data: volunteerData, error: volunteerError } = await supabase
            .from("volunteer.recruiters")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (volunteerError) {
            console.error("Error fetching volunteer profile:", volunteerError)
            throw new Error("Failed to fetch user profile")
          }

          userData = volunteerData

          // Check if volunteer is active
          if (!userData?.is_active) {
            router.push("/volunteer-pending")
            return
          }
        } else if (userType === "admin") {
          const { data: adminData, error: adminError } = await supabase
            .from("admin.users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (adminError) {
            console.error("Error fetching admin profile:", adminError)
            throw new Error("Failed to fetch user profile")
          }

          userData = adminData
        } else {
          // Default to recruit
          const { data: recruitData, error: recruitError } = await supabase
            .from("recruit.users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (recruitError) {
            console.error("Error fetching recruit profile:", recruitError)
            throw new Error("Failed to fetch user profile")
          }

          userData = recruitData
        }

        // Login the user in the context
        login({
          id: data.user.id,
          name: userData?.name || data.user.email?.split("@")[0] || "User",
          email: data.user.email || email || "unknown@example.com",
          participation_count: userData?.points || 0,
          has_applied: userData?.has_applied || false,
        })

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
      }
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
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!email) {
        throw new Error("Email is required")
      }

      // Use the appropriate auth service based on user type
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split("@")[0],
            first_name: firstName,
            last_name: lastName,
            phone,
            zip_code: zipCode,
            organization,
            position,
            location,
            referral_source: referralSource,
            referral_code: referralCode,
            user_type: userType,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create user profile based on user type
        if (userType === "volunteer") {
          const { error: profileError } = await supabase.from("volunteer.recruiters").insert([
            {
              id: data.user.id,
              name: name || email.split("@")[0],
              email,
              organization,
              position,
              location,
              is_active: false, // Volunteers need to be approved
            },
          ])

          if (profileError) {
            console.error("Error creating volunteer profile:", profileError)
            throw new Error("Failed to create user profile")
          }

          // Redirect to pending page
          router.push("/volunteer-pending")
          return
        } else {
          // Default to recruit
          const { error: profileError } = await supabase.from("recruit.users").insert([
            {
              id: data.user.id,
              name: name || email.split("@")[0],
              email,
              first_name: firstName,
              last_name: lastName,
              phone,
              zip_code: zipCode,
              referral_source: referralSource,
              referral_code: referralCode,
              points: 0,
              has_applied: false,
            },
          ])

          if (profileError) {
            console.error("Error creating recruit profile:", profileError)
            throw new Error("Failed to create user profile")
          }

          // Login the user in the context
          login({
            id: data.user.id,
            name: name || email.split("@")[0],
            email: email || data.user.email || "",
            participation_count: 0,
            has_applied: false,
          })

          toast({
            title: "Sign up successful",
            description: "Welcome to the SF Deputy Sheriff recruitment program!",
          })

          // Redirect to appropriate page
          if (callbackUrl) {
            router.push(callbackUrl)
          } else {
            router.push("/dashboard")
          }
        }
      }
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
      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !zipCode) {
        throw new Error("Please fill in all required fields")
      }

      // Create opt-in record
      const { error } = await supabase.from("recruit.opt_ins").insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          zip_code: zipCode,
          referral_source: referralSource,
          referral_code: referralCode,
          tracking_number: trackingNumber,
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      toast({
        title: "Thank you for your interest!",
        description: "We'll be in touch with more information about the application process.",
      })

      // Redirect after a delay
      setTimeout(() => {
        if (isApplying) {
          router.push("https://careers.sf.gov/interest/public-safety/sheriff/")
        } else {
          onClose()
        }
      }, 2000)
    } catch (error) {
      console.error("Opt-in error:", error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "facebook" | "twitter" | "linkedin" | "apple") => {
    if (!isBrowser()) return
    
    setSocialLoading(provider)

    try {
      // Set appropriate redirect URL based on user type
      let redirectTo = `${origin}/auth/callback`
      if (userType === "volunteer") {
        redirectTo = `${origin}/auth/callback?userType=volunteer`
      } else if (userType === "admin") {
        redirectTo = `${origin}/auth/callback?userType=admin`
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error

      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      console.error("Social auth error:", error)
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }

  const handleMagicLinkAuth = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/dashboard`,
        },
      })

      if (error) throw error

      toast({
        title: "Magic link sent",
        description: "Check your email for a link to sign in",
      })

      setIsLoading(false)
      onClose()
    } catch (error) {
      console.error("Magic link error:", error)
      toast({
        title: "Failed to send magic link",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
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

  const getDialogTitle = () => {
    if (title) return title

    if (activeTab === "optin") {
      return isApplying ? "Start Your Deputy Sheriff Application" : "Sign up for Recruitment Updates"
    } else if (activeTab === "signin") {
      return userType === "volunteer" ? "Volunteer Recruiter Login" : "Welcome Back"
    } else {
      return userType === "volunteer" ? "Register as a Volunteer Recruiter" : "Create Account"
    }
  }

  const getDialogDescription = () => {
    if (description) return description

    if (activeTab === "optin") {
      return isApplying
        ? "Take the first step toward a rewarding career with the San Francisco Sheriff's Office."
        : "Get the latest information about the SF Deputy Sheriff recruitment process, events, and opportunities."
    } else if (activeTab === "signin") {
      return userType === "volunteer"
        ? "Sign in to access your volunteer recruiter dashboard"
        : "Sign in to your account to continue"
    } else {
      return userType === "volunteer"
        ? "Register to become a volunteer recruiter for the SF Deputy Sheriff's Office"
        : "Create a new account to get started"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">{getDialogTitle()}</DialogTitle>
              <DialogDescription className="text-center">{getDialogDescription()}</DialogDescription>
            </DialogHeader>

            {renderPointsMessage()}

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup" | "optin")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                {userType === "recruit" && <TabsTrigger value="optin">Opt-In</TabsTrigger>}
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

                    <div className="grid grid-cols-2 gap-2">
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
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("facebook")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center"
                      >
                        {socialLoading === "facebook" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Facebook className="h-4 w-4 mr-2" />
                        )}
                        Facebook
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("twitter")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center"
                      >
                        {socialLoading === "twitter" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Twitter className="h-4 w-4 mr-2" />
                        )}
                        Twitter
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialAuth("apple")}
                        disabled={!!socialLoading}
                        className="flex items-center justify-center"
                      >
                        {socialLoading === "apple" ? (
                          <span className="animate-spin">⟳</span>
                        ) : (
                          <Apple className="h-4 w-4 mr-2" />
                        )}
                        Apple
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleMagicLinkAuth}
                      disabled={isLoading || !email}
                      className="w-full mt-2"
                    >
                      Sign in with Magic Link
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {userType === "volunteer" ? (
                    // Volunteer recruiter signup form
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(415) 555-1234"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input
                          id="organization"
                          placeholder="Your organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          placeholder="Your position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="San Francisco, CA"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    // Regular recruit signup form
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
                  )}

                  {userType !== "volunteer" && (
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
                  )}

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

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
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

                  {userType !== "volunteer" && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
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
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                          Google
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialAuth("facebook")}
                          disabled={!!socialLoading}
                          className="flex items-center justify-center"
                        >
                          {socialLoading === "facebook" ? (
                            <span className="animate-spin">⟳</span>
                          ) : (
                            <Facebook className="h-4 w-4 mr-2" />
                          )}
                          Facebook
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialAuth("twitter")}
                          disabled={!!socialLoading}
                          className="flex items-center justify-center"
                        >
                          {socialLoading === "twitter" ? (
                            <span className="animate-spin">⟳</span>
                          ) : (
                            <Twitter className="h-4 w-4 mr-2" />
                          )}
                          Twitter
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialAuth("apple")}
                          disabled={!!socialLoading}
                          className="flex items-center justify-center"
                        >
                          {socialLoading === "apple" ? (
                            <span className="animate-spin">⟳</span>
                          ) : (
                            <Apple className="h-4 w-4 mr-2" />
                          )}
                          Apple
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </TabsContent>

              {userType === "recruit" && (
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
                    <div className="space-y-2">
                      <Label htmlFor="referralSource">How did you hear about us?</Label>
                      <select
                        id="referralSource"
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.target.value)}
                        className="w-full border border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F] rounded-md p-2"
                      >
                        <option value="website">Website</option>
                        <option value="social_media">Social Media</option>
                        <option value="friend">Friend or Family</option>
                        <option value="event">Recruitment Event</option>
                        <option value="other">Other</option>
                      </select>
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
              )}
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
