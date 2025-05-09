"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function DonationForm() {
  const [activeTab, setActiveTab] = useState("one-time")
  const [amount, setAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAmountChange = (value: string) => {
    if (value === "custom") {
      setAmount(0)
    } else {
      setAmount(Number.parseInt(value))
      setCustomAmount("")
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value)
      setAmount(Number.parseFloat(value) || 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const finalAmount = amount || Number.parseFloat(customAmount) || 0

      if (finalAmount < 1) {
        setError("Please enter a valid donation amount of at least $1")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email,
          name,
          isRecurring: activeTab === "recurring",
          interval: "month", // Could be made selectable in the UI
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setClientSecret(data.clientSecret)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#10b981",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
      },
    },
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!clientSecret ? (
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>Support the San Francisco Deputy Sheriff&apos;s Association</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="one-time">One-time</TabsTrigger>
                <TabsTrigger value="recurring">Monthly</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="donation-amount">Donation Amount</Label>
                  <RadioGroup defaultValue="25" onValueChange={handleAmountChange} className="grid grid-cols-4 gap-2">
                    <div>
                      <RadioGroupItem value="10" id="amount-10" className="sr-only" />
                      <Label
                        htmlFor="amount-10"
                        className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        $10
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="25" id="amount-25" className="sr-only" />
                      <Label
                        htmlFor="amount-25"
                        className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        $25
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="50" id="amount-50" className="sr-only" />
                      <Label
                        htmlFor="amount-50"
                        className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        $50
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="100" id="amount-100" className="sr-only" />
                      <Label
                        htmlFor="amount-100"
                        className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        $100
                      </Label>
                    </div>
                    <div className="col-span-4 mt-2">
                      <RadioGroupItem value="custom" id="amount-custom" className="sr-only" />
                      <Label
                        htmlFor="amount-custom"
                        className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <span>Custom Amount</span>
                        <Input
                          type="text"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          className="w-24 h-7 text-right"
                          onClick={() => handleAmountChange("custom")}
                        />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>

                {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Donate ${amount ? `$${amount}` : ""}`
                  )}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm amount={amount} isRecurring={activeTab === "recurring"} />
        </Elements>
      )}
    </div>
  )
}

function CheckoutForm({ amount, isRecurring }: { amount: number; isRecurring: boolean }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/thank-you`,
      },
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
    }

    setIsLoading(false)
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

          {message && <div className="text-sm text-red-500 mt-4">{message}</div>}

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit" disabled={isLoading || !stripe || !elements}>
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
