"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface OptInFormProps {
  onClose: () => void
  isApplying?: boolean
  isOpen?: boolean
  referralCode?: string
}

export function OptInForm({ onClose, isApplying = false, isOpen = false, referralCode }: OptInFormProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { getClientSideSupabase } = require("@/lib/supabase")
      const supabase = getClientSideSupabase()
      // Create application record
      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            referral_code: referralCode,
            status: "pending",
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      })

      onClose()
      router.push("/application-submitted")
    } catch (error) {
      console.error("Application submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl">Apply Now</DialogTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Start your journey with the San Francisco Deputy Sheriff's Department.
            </p>
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
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3C1F]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
