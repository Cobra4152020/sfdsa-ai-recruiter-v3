"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"

export const metadata: Metadata = {
  title: "Contact Support | SF Deputy Sheriff Recruitment",
  description: "Get help with your application process or general inquiries about becoming a San Francisco Deputy Sheriff.",
}

export default function SupportPage() {
  const [category, setCategory] = useState("general")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0A3C1F] mb-2">Contact Support</h1>
        <p className="text-gray-700">
          Need help? Our support team is here to assist you with any questions or concerns.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Support Options</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Chat with Sgt. Ken</h3>
              <p className="text-gray-700 mb-3">
                Get instant answers to common questions about recruitment and the application process.
              </p>
              <AskSgtKenButton variant="secondary" position="static" />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Phone Support</h3>
              <p className="text-gray-700">
                Call us at (415) 696-2428<br />
                Monday - Friday: 8:00 AM - 5:00 PM PT
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Visit Us</h3>
              <p className="text-gray-700">
                680 8th Street, Suite 200<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={category}
                  onValueChange={setCategory}
                >
                  <option value="general">General Inquiry</option>
                  <option value="application">Application Help</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your full name" required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email address" required />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
              >
                Send Message
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-700 mb-4">
                We'll get back to you within 1-2 business days.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
              >
                Send Another Message
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Application Status</h3>
              <p className="text-gray-700">
                Check your application status by logging into your recruitment portal account.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Document Requirements</h3>
              <p className="text-gray-700">
                Find a complete list of required documents in our application guide.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Testing Schedule</h3>
              <p className="text-gray-700">
                View upcoming test dates and locations in your candidate portal.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Benefits Information</h3>
              <p className="text-gray-700">
                Learn about our comprehensive benefits package on our benefits page.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 