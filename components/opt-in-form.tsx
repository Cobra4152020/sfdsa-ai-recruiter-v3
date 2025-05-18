"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { getWindowOrigin, isBrowser } from "@/lib/utils"
import { useClientOnly } from "@/hooks/use-client-only"

interface OptInFormProps {
  onClose: () => void
  isApplying?: boolean
  isOpen?: boolean
  referralCode?: string
}

export function OptInForm({ onClose, isApplying = false, isOpen = true, referralCode }: OptInFormProps) {
  const router = useRouter()
  const origin = useClientOnly(() => getWindowOrigin(), '')
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [referralSource, setReferralSource] = useState("website")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleClose = () => {
    setIsDialogOpen(false)
    onClose()
  }

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (phone.trim() && !/^[\d\s$$$$\-+]{10,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (zipCode.trim() && !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to receive communications"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generate a unique tracking number
  useEffect(() => {
    // Format: SFDSA-[Direct/Referral]-[Random 6 characters]
    const prefix = referralCode ? "SFDSA-REF" : "SFDSA-DIR"
    const randomPart = uuidv4().substring(0, 6).toUpperCase()
    setTrackingNumber(`${prefix}-${randomPart}`)
  }, [referralCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Save to database
      const { error: dbError } = await supabase.from("applicants").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        zip_code: zipCode || null,
        referral_source: referralSource,
        referral_code: referralCode || null,
        tracking_number: trackingNumber,
        application_status: isApplying ? "started" : "interested",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (dbError) {
        console.error("Error submitting form:", dbError)

        // Special handling for duplicate emails
        if (dbError.code === "23505" && dbError.message.includes("email")) {
          setError("This email address is already registered. Please use a different email or contact support.")
        } else {
          setError("There was a problem submitting your information. Please try again later.")
        }

        setIsSubmitting(false)
        return
      }

      // Show success message
      setIsSubmitted(true)

      // Log success in analytics
      try {
        await fetch(`${origin}/api/analytics/page-view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: isApplying ? "application_started" : "opt_in_completed",
            properties: {
              referral_source: referralSource,
              has_referral_code: !!referralCode,
            },
          }),
        })
      } catch (analyticsError) {
        console.error("Analytics error:", analyticsError)
      }

      // Redirect after showing success message
      setTimeout(() => {
        if (isApplying) {
          // For external URLs, use window.location.href
          if (isBrowser()) {
            window.location.href = "https://careers.sf.gov/interest/public-safety/sheriff/"
          }
        } else {
          handleClose()
        }
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("There was a problem connecting to our service. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-[#FFD700]" />
              </div>
              <DialogTitle className="text-center text-xl">
                {isApplying ? "Start Your Deputy Sheriff Application" : "Sign up for Recruitment Updates"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {isApplying
                  ? "Take the first step toward a rewarding career with the San Francisco Sheriff's Office."
                  : "Get the latest information about the SF Deputy Sheriff recruitment process, events, and opportunities."}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className={cn(
                      "border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]",
                      errors.firstName ? "border-red-500" : "",
                    )}
                    aria-invalid={errors.firstName ? "true" : "false"}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                    className={cn(
                      "border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]",
                      errors.lastName ? "border-red-500" : "",
                    )}
                    aria-invalid={errors.lastName ? "true" : "false"}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className={cn(
                    "border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]",
                    errors.email ? "border-red-500" : "",
                  )}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-1234"
                  className={cn(
                    "border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]",
                    errors.phone ? "border-red-500" : "",
                  )}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="94102"
                  className={cn(
                    "border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]",
                    errors.zipCode ? "border-red-500" : "",
                  )}
                  aria-invalid={errors.zipCode ? "true" : "false"}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Select value={referralSource} onValueChange={setReferralSource}>
                  <SelectTrigger
                    id="referralSource"
                    className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                  >
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend">Friend or Family</SelectItem>
                    <SelectItem value="event">Recruitment Event</SelectItem>
                    <SelectItem value="current_employee">Current Employee</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  required
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
                <div>
                  <Label htmlFor="terms" className="text-sm">
                    I agree to receive communications about the San Francisco Sheriff's Office recruitment process.
                  </Label>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                  {isSubmitting ? "Submitting..." : isApplying ? "Start Application" : "Sign Up"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
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

// Utility function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
