"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { authService, type AuthResult } from "@/lib/unified-auth-service"
import { AlertCircle } from "lucide-react"

interface UnifiedRegistrationPopupProps {
  isOpen: boolean
  onClose: () => void
  userType?: "recruit" | "volunteer"
  title?: string
  description?: string
  requiredPoints?: number
  actionName?: string
}

export function UnifiedRegistrationPopup({
  isOpen,
  onClose,
  userType = "recruit",
  title,
  description,
  requiredPoints,
  actionName,
}: UnifiedRegistrationPopupProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.signInWithPassword(email, password)

      if (!result.success) {
        throw new Error(result.message)
      }

      window.location.href = result.redirectUrl || "/dashboard"
    } catch (error) {
      console.error("Sign in error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let result: AuthResult
      if (userType === "volunteer") {
        result = await authService.registerVolunteerRecruiter(
          email,
          password,
          firstName,
          lastName,
          "", // phone
          "", // organization
          "", // position
          "", // location
        )
      } else {
        result = await authService.registerRecruit(email, password, `${firstName} ${lastName}`)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      window.location.href = result.redirectUrl || "/dashboard"
    } catch (error) {
      console.error("Sign up error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign up")
    } finally {
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

    if (activeTab === "signin") {
      return userType === "volunteer" ? "Volunteer Recruiter Login" : "Welcome Back"
    } else {
      return userType === "volunteer" ? "Register as a Volunteer Recruiter" : "Create Account"
    }
  }

  const getDialogDescription = () => {
    if (description) return description

    if (activeTab === "signin") {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || "Sign In or Register"}</DialogTitle>
          <DialogDescription>
            {description || "Sign in to your account or create a new one to continue."}
          </DialogDescription>
        </DialogHeader>

        {renderPointsMessage()}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <Button
                    type="submit"
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        Registering...
                      </span>
                    ) : (
                      "Register as Volunteer"
                    )}
                  </Button>
                </>
              ) : (
                // Regular recruit signup form
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <Button
                    type="submit"
                    className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⟳</span>
                        Registering...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
