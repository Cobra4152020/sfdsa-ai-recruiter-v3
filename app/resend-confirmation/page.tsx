"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResendConfirmationPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setStatus("idle")
    setMessage("")

    try {
      const response = await fetch("/api/resend-volunteer-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Confirmation email has been resent. Please check your inbox.")
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to resend confirmation email.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Link
            href="/volunteer-login"
            className="inline-flex items-center text-[#0A3C1F] hover:text-[#0A3C1F]/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Resend Confirmation Email</CardTitle>
              <CardDescription className="text-center">
                Enter your email address to receive a new confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "success" && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span>
                      Sending...
                    </span>
                  ) : (
                    "Resend Confirmation Email"
                  )}
                </Button>
              </form>

              {status === "success" && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F]"
                    onClick={() => router.push("/volunteer-login")}
                  >
                    Return to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
