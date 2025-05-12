"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, CheckCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-service"

interface OptInFormProps {
  onClose: () => void
  isApplying?: boolean
  isOpen?: boolean
  referralCode?: string
}

export function OptInForm({ onClose, isApplying = false, isOpen = true, referralCode }: OptInFormProps) {
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
  const { toast } = useToast()

  const handleClose = () => {
    setIsDialogOpen(false)
    onClose()
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
    setIsSubmitting(true)

    try {
      // Save to database
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
        setIsSubmitting(false)
        return
      }

      // Show success message
      setIsSubmitted(true)

      // Redirect after showing success message
      setTimeout(() => {
        if (isApplying) {
          window.location.href = "https://careers.sf.gov/interest/public-safety/sheriff/"
        } else {
          handleClose()
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to receive communications about the San Francisco Sheriff's Office recruitment process.
                </Label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !agreeToTerms}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                >
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
