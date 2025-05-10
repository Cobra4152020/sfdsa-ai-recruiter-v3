"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface DonationFormProps {
  amount: number
  isRecurring: boolean
  onCancel?: () => void
}

export function DonationForm({ amount, isRecurring, onCancel }: DonationFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [allowRecognition, setAllowRecognition] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setMessage("Stripe has not been properly initialized.")
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/thank-you`,
        },
      })

      if (error) {
        setMessage(error.message || "An unexpected error occurred.")
        setIsLoading(false)
      }
      // If successful, the page will redirect to the return_url
    } catch (err) {
      console.error("Payment confirmation error:", err)
      setMessage((err as Error).message || "An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Donation</CardTitle>
        <CardDescription>
          {isRecurring
            ? `You're setting up a monthly donation of $${amount}`
            : `You're making a one-time donation of $${amount}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement id="payment-element" />

          <div className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              id="recognition"
              className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
              checked={allowRecognition}
              onChange={(e) => setAllowRecognition(e.target.checked)}
            />
            <Label htmlFor="recognition" className="text-sm font-normal">
              I would like my name to appear on the donor recognition wall
            </Label>
          </div>

          {message && <div className="text-sm text-red-500 mt-4">{message}</div>}

          <div className="flex justify-between mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Back
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !stripe || !elements} className={onCancel ? "" : "w-full"}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Donation"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
