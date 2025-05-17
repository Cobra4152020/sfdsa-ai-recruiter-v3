"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, Shield, UserPlus, GraduationCap } from "lucide-react"

export function RecruiterOnboarding() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    referralSource: "",
    reason: "",
    agreeTerms: false,
    agreePrivacy: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulating API call for registration
    try {
      // In a real implementation, this would be an API call to register the volunteer
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Application submitted!",
        description: "Your volunteer recruiter application has been submitted for review.",
        duration: 5000,
      })

      // Move to success step
      setStep(3)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Volunteer Recruiter Program</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join our team of volunteer recruiters and help build the future of the San Francisco Sheriff's Department.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
        <div className={`relative z-10 flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <UserPlus className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Register</span>
        </div>
        <div className={`relative z-10 flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <Shield className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Verify</span>
        </div>
        <div className={`relative z-10 flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-medium">Complete</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Recruiter Registration</CardTitle>
            <CardDescription>
              Fill out the form below to join our volunteer recruiter program. Once approved, you'll be able to refer
              candidates and track your referrals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setStep(2)
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization (if applicable)</Label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="San Francisco Community Group"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Community Liaison"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How did you hear about our volunteer recruiter program?</Label>
                <Select
                  value={formData.referralSource}
                  onValueChange={(value) => handleSelectChange("referralSource", value)}
                >
                  <SelectTrigger id="referralSource">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_employee">Current Sheriff's Department Employee</SelectItem>
                    <SelectItem value="former_employee">Former Sheriff's Department Employee</SelectItem>
                    <SelectItem value="community_event">Community Event</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Why do you want to become a volunteer recruiter? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Tell us why you're interested in helping recruit for the San Francisco Sheriff's Department..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Continue to Next Step
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Confirm</CardTitle>
            <CardDescription>
              Please review your information and agree to the terms and conditions before submitting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</h4>
                    <p className="text-sm font-medium">{formData.firstName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</h4>
                    <p className="text-sm font-medium">{formData.lastName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                    <p className="text-sm font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                    <p className="text-sm font-medium">{formData.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</h4>
                    <p className="text-sm font-medium">{formData.organization || "Not provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</h4>
                    <p className="text-sm font-medium">{formData.position || "Not provided"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Why you want to join</h4>
                  <p className="text-sm font-medium">{formData.reason}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="/terms-of-service" className="text-primary underline">
                      Terms of Service
                    </a>{" "}
                    and acknowledge my responsibilities as a volunteer recruiter.
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => handleCheckboxChange("agreePrivacy", checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="agreePrivacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="/privacy-policy" className="text-primary underline">
                      Privacy Policy
                    </a>{" "}
                    and consent to the collection and processing of my data.
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="sm:flex-1">
                  Go Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.agreeTerms || !formData.agreePrivacy}
                  className="sm:flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Application Submitted!</CardTitle>
            <CardDescription>Thank you for applying to our volunteer recruiter program.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              We've received your application and will review it shortly. You'll receive an email at{" "}
              <strong>{formData.email}</strong> with further instructions.
            </p>
            <p>
              Once approved, you'll be able to generate referral links, contact potential recruits, and track your
              performance through your personal dashboard.
            </p>

            <div className="pt-4">
              <Button onClick={() => (window.location.href = "/")} className="bg-primary hover:bg-primary/90">
                Return to Home Page
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t px-6 py-4 text-center text-sm text-gray-500">
            If you have any questions, please contact us at{" "}
            <a href="mailto:email@protectingsanfrancisco.com" className="text-primary">
              email@protectingsanfrancisco.com
            </a>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
