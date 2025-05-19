"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useAuthModal } from "@/context/auth-modal-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { OptInForm } from "@/components/opt-in-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { getClientSideSupabase } from "@/lib/supabase"

export function UnifiedAuthModal() {
  const { isOpen, modalType, userType, referralCode, closeModal } = useAuthModal()
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "optin">("signin")
  const [showOptIn, setShowOptIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const supabase = getClientSideSupabase()

  useEffect(() => {
    if (isOpen) {
      setActiveTab(modalType)
      setShowOptIn(modalType === "optin")
    }
  }, [isOpen, modalType])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Successfully signed in!",
      })

      closeModal()
      router.refresh()
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      })

      setActiveTab("signin")
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle the opt-in form close
  const handleOptInClose = () => {
    closeModal()
  }

  // If showing the opt-in form, render it directly
  if (showOptIn) {
    return <OptInForm onClose={handleOptInClose} isApplying={true} isOpen={isOpen} referralCode={referralCode} />
  }

  // Otherwise render the auth tabs
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl">
            {activeTab === "signin" ? "Sign In" : activeTab === "signup" ? "Create Account" : "Apply Now"}
          </DialogTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={closeModal}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sign in to your account using your email and password.</p>
              </div>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <button 
                    type="button"
                    className="text-sm text-[#0A3C1F] hover:underline" 
                    onClick={() => setActiveTab("signup")}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Create a new account to join our community.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-[#0A3C1F] hover:underline"
                    onClick={() => setShowOptIn(true)}
                  >
                    Interested in applying? Start application
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
