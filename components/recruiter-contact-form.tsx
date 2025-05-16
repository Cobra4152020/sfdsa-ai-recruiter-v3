"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RecruiterContactForm() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formState.firstName || !formState.lastName || !formState.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // API call to send email
      const response = await fetch("/api/volunteer-recruiter/send-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
          // Include the recruiter's information
          // recruiterId: currentUser?.id,
          // recruiterName: currentUser?.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email")
      }

      // Success
      setSuccessMessage(
        `Your message has been sent to ${formState.firstName} ${formState.lastName} from our official email address. We've also saved their information to your dashboard.`,
      )
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Potential Recruits</CardTitle>
          <CardDescription>
            Send a personalized email directly from our official email address (email@protectingsanfrancisco.com). The
            recipient will be automatically added to your dashboard for easy follow-up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formState.firstName}
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
                  value={formState.lastName}
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
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formState.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personalized Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Enter your personalized message here. This will be included in the email sent to the recruit."
                value={formState.message}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Email & Save Contact"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              <strong>Note:</strong> The email will be sent from our official email address
              (email@protectingsanfrancisco.com) with your name in the signature to ensure the recipient recognizes the
              sender.
            </p>
            <p>All information will be stored securely and used only for recruitment purposes.</p>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
          <CardDescription>A list of potential recruits you've recently contacted.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-center py-3 px-4">Date Contacted</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Emily Johnson</div>
                  </td>
                  <td className="py-3 px-4 text-sm">emily.johnson@example.com</td>
                  <td className="text-center py-3 px-4 text-sm">May 15, 2023</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      Follow Up
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Michael Chen</div>
                  </td>
                  <td className="py-3 px-4 text-sm">michael.chen@example.com</td>
                  <td className="text-center py-3 px-4 text-sm">June 2, 2023</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Signed Up</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Sophia Rodriguez</div>
                  </td>
                  <td className="py-3 px-4 text-sm">sophia.rodriguez@example.com</td>
                  <td className="text-center py-3 px-4 text-sm">June 10, 2023</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Responded</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      Follow Up
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
