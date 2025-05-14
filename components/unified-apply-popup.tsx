"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Star, Shield, User } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<string>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      onClose()
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("recruit_users").insert({
          user_id: authData.user.id,
          full_name: fullName,
          email,
          created_at: new Date().toISOString(),
        })

        if (profileError) throw profileError

        // Award initial points
        const { error: pointsError } = await supabase.from("user_points").insert({
          user_id: authData.user.id,
          points: 10,
          reason: "Joining the platform",
          created_at: new Date().toISOString(),
        })

        if (pointsError) console.error("Error awarding initial points:", pointsError)

        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        })

        onClose()
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.refresh()
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the SF Deputy Sheriff's Association</DialogTitle>
          <DialogDescription>
            {requiredPoints > 0
              ? `You need ${requiredPoints} points to ${actionName}. Please sign in or create an account.`
              : `Please sign in or create an account to ${actionName}.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
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

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <span className="mt-1 text-xs text-center">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <span className="mt-1 text-xs text-center">Earn Points</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <span className="mt-1 text-xs text-center">Community</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
