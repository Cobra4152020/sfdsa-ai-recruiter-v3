"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Coffee, Heart, Trophy, Star } from "lucide-react"

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState<string>("10")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [donorName, setDonorName] = useState<string>("")
  const [donorEmail, setDonorEmail] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [donationMessage, setDonationMessage] = useState<string>("")
  const { toast } = useToast()

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real implementation, this would connect to a payment processor
    toast({
      title: "Thank you for your donation!",
      description: `Your $${customAmount || donationAmount} donation to Protecting San Francisco is being processed.`,
      duration: 5000,
    })

    // Reset form
    setDonationAmount("10")
    setCustomAmount("")
    setDonorName("")
    setDonorEmail("")
    setIsAnonymous(false)
    setDonationMessage("")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">Support Protecting San Francisco</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donations help maintain this recruitment platform and support our mission to build a stronger, safer
            San Francisco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white border-[#0A3C1F]/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Coffee className="h-8 w-8 text-[#0A3C1F]" />
              </div>
              <CardTitle className="text-xl text-[#0A3C1F]">Buy Sgt. Ken a Coffee</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-2">
              <p className="text-gray-600 mb-4">
                Help keep Sgt. Ken caffeinated and ready to assist potential recruits!
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("5")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $5 donation",
                    })
                  }}
                >
                  $5
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("10")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $10 donation",
                    })
                  }}
                >
                  $10
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#0A3C1F]/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-[#0A3C1F]" />
              </div>
              <CardTitle className="text-xl text-[#0A3C1F]">Support the Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-2">
              <p className="text-gray-600 mb-4">
                Help us maintain and improve this recruitment platform for future deputies.
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("25")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $25 donation",
                    })
                  }}
                >
                  $25
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("50")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $50 donation",
                    })
                  }}
                >
                  $50
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#0A3C1F]/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Heart className="h-8 w-8 text-[#0A3C1F]" />
              </div>
              <CardTitle className="text-xl text-[#0A3C1F]">Become a Benefactor</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-2">
              <p className="text-gray-600 mb-4">Make a significant impact with a larger donation to our mission.</p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("100")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $100 donation",
                    })
                  }}
                >
                  $100
                </Button>
                <Button
                  variant="outline"
                  className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                  onClick={() => {
                    setDonationAmount("250")
                    setCustomAmount("")
                    toast({
                      title: "Amount selected",
                      description: "You've selected a $250 donation",
                    })
                  }}
                >
                  $250
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="one-time" className="max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="one-time">One-Time Donation</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Support</TabsTrigger>
          </TabsList>

          <TabsContent value="one-time">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0A3C1F]">Make a One-Time Donation</CardTitle>
                <CardDescription>
                  Your donation will support the maintenance and improvement of our recruitment platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonationSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="donation-amount">Donation Amount</Label>
                      <RadioGroup
                        defaultValue="10"
                        value={donationAmount}
                        onValueChange={(value) => {
                          setDonationAmount(value)
                          setCustomAmount("")
                        }}
                        className="grid grid-cols-4 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="10" id="amount-10" className="peer sr-only" />
                          <Label
                            htmlFor="amount-10"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$10</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="25" id="amount-25" className="peer sr-only" />
                          <Label
                            htmlFor="amount-25"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$25</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="50" id="amount-50" className="peer sr-only" />
                          <Label
                            htmlFor="amount-50"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$50</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="100" id="amount-100" className="peer sr-only" />
                          <Label
                            htmlFor="amount-100"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$100</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-amount">Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="custom-amount"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Enter amount"
                          className="pl-8"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setDonationAmount("")
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donor-name">Your Name (Optional)</Label>
                      <Input
                        id="donor-name"
                        placeholder="Enter your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Email Address</Label>
                      <Input
                        id="donor-email"
                        type="email"
                        placeholder="Enter your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">We'll send your donation receipt to this email.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <Label htmlFor="anonymous" className="text-sm font-normal">
                        Make my donation anonymous
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <textarea
                        id="message"
                        rows={3}
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Share why you're supporting us"
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end pt-6 px-0">
                    <Button
                      type="submit"
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                      disabled={!donorEmail || (!donationAmount && !customAmount)}
                    >
                      Donate Now
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0A3C1F]">Become a Monthly Supporter</CardTitle>
                <CardDescription>
                  Your recurring donation provides sustainable support for our recruitment efforts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonationSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-amount">Monthly Amount</Label>
                      <RadioGroup
                        defaultValue="10"
                        value={donationAmount}
                        onValueChange={(value) => {
                          setDonationAmount(value)
                          setCustomAmount("")
                        }}
                        className="grid grid-cols-4 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="5" id="monthly-5" className="peer sr-only" />
                          <Label
                            htmlFor="monthly-5"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$5</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="10" id="monthly-10" className="peer sr-only" />
                          <Label
                            htmlFor="monthly-10"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$10</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="25" id="monthly-25" className="peer sr-only" />
                          <Label
                            htmlFor="monthly-25"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$25</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="50" id="monthly-50" className="peer sr-only" />
                          <Label
                            htmlFor="monthly-50"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                          >
                            <span>$50</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly-custom">Custom Monthly Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="monthly-custom"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Enter amount"
                          className="pl-8"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value)
                            setDonationAmount("")
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly-name">Your Name (Optional)</Label>
                      <Input
                        id="monthly-name"
                        placeholder="Enter your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly-email">Email Address</Label>
                      <Input
                        id="monthly-email"
                        type="email"
                        placeholder="Enter your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">We'll send your donation receipts to this email.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="monthly-anonymous"
                        className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <Label htmlFor="monthly-anonymous" className="text-sm font-normal">
                        Make my donations anonymous
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly-message">Message (Optional)</Label>
                      <textarea
                        id="monthly-message"
                        rows={3}
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Share why you're supporting us"
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end pt-6 px-0">
                    <Button
                      type="submit"
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                      disabled={!donorEmail || (!donationAmount && !customAmount)}
                    >
                      Subscribe
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-[#0A3C1F]/5 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[#0A3C1F] mb-4">Where Your Donation Goes</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Star className="h-5 w-5 text-[#0A3C1F]" />
              </div>
              <div>
                <h3 className="font-medium">Platform Maintenance</h3>
                <p className="text-gray-600 text-sm">
                  Keeping our recruitment platform running smoothly with regular updates and technical support.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Star className="h-5 w-5 text-[#0A3C1F]" />
              </div>
              <div>
                <h3 className="font-medium">Recruitment Resources</h3>
                <p className="text-gray-600 text-sm">
                  Developing educational materials and resources to help potential recruits prepare for a career in law
                  enforcement.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Star className="h-5 w-5 text-[#0A3C1F]" />
              </div>
              <div>
                <h3 className="font-medium">Community Outreach</h3>
                <p className="text-gray-600 text-sm">
                  Supporting outreach programs that connect with diverse communities to build a more representative
                  Sheriff's Department.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Star className="h-5 w-5 text-[#0A3C1F]" />
              </div>
              <div>
                <h3 className="font-medium">Sgt. Ken AI Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Improving and maintaining our AI assistant to provide 24/7 support to potential recruits with
                  questions about joining the Sheriff's Department.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Protecting San Francisco is a 501(c)(3) non-profit organization. All donations are tax-deductible.
          </p>
          <p className="text-sm text-gray-500">Tax ID: 12-3456789</p>
        </div>
      </div>
    </div>
  )
}
