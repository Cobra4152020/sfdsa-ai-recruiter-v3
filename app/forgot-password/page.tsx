"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase-core"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "An error occurred during password reset",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-[#0A3C1F]">Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Check your email for a password reset link"
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
                  instructions to reset your password.
                </p>
                <p className="text-sm text-gray-500">
                  If you don't see the email, check your spam folder or request another reset link.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" className="text-[#0A3C1F] flex items-center" onClick={() => router.push("/login")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </main>
      <ImprovedFooter />
    </>
  )
}
