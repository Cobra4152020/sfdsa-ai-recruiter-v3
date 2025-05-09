"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, CheckCircle } from "lucide-react"

interface OptInFormProps {
  onClose: () => void
  isApplying?: boolean
  isOpen?: boolean
}

export function OptInForm({ onClose, isApplying = false, isOpen = true }: OptInFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [interest, setInterest] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleClose = () => {
    setIsDialogOpen(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)

      // Close dialog after showing success message
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                />
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
                <Label htmlFor="interest">Area of Interest</Label>
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger
                    id="interest"
                    className="border-[#0A3C1F]/30 focus:border-[#0A3C1F] focus:ring-[#0A3C1F]"
                  >
                    <SelectValue placeholder="Select your interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Information</SelectItem>
                    <SelectItem value="application">Application Process</SelectItem>
                    <SelectItem value="requirements">Qualifications & Requirements</SelectItem>
                    <SelectItem value="benefits">Salary & Benefits</SelectItem>
                    <SelectItem value="training">Academy & Training</SelectItem>
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
            <p className="text-gray-500 dark:text-gray-400">
              {isApplying
                ? "Your application has been initiated. Check your email for next steps."
                : "You've been added to our recruitment updates list."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
