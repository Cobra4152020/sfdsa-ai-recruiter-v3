"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  Heart,
  Trophy,
  Star,
  CreditCard,
  HandHeart,
  Users,
  BookOpen,
  Building,
  Info,
  Shield,
  DollarSign,
  Mail,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { DonationForm } from "@/components/donation-form";
import { VenmoOption } from "@/components/venmo-option";
import Image from "next/image";
import { DonationImpactDisplay } from "@/components/donation-impact-display";
import { MonthlyImpactCalculator } from "@/components/monthly-impact-calculator";
import { PageWrapper } from "@/components/page-wrapper";
import { useUser } from "@/context/user-context";
import Link from "next/link";

// Load Stripe outside of component to avoid recreating it
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function DonatePage() {
  const { currentUser } = useUser();
  const [donationAmount, setDonationAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donationMessage, setDonationMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "venmo">(
    "stripe",
  );
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [allowRecognition, setAllowRecognition] = useState<boolean>(false);
  const [donationAttempts, setDonationAttempts] = useState(0);

  // Pre-fill form data for authenticated users
  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || "");
      setDonorEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Track donation attempts for enhanced UX
  useEffect(() => {
    const storedAttempts = localStorage.getItem('donation_attempts');
    if (storedAttempts) {
      setDonationAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  const amount = customAmount || donationAmount;

  const handlePreparePayment = async () => {
    if (!amount || !donorEmail) {
      toast({
        title: "Missing information",
        description: "Please provide your email and donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "stripe") {
      setIsLoading(true);
      try {
        // Track donation attempt
        const newAttempts = donationAttempts + 1;
        setDonationAttempts(newAttempts);
        localStorage.setItem('donation_attempts', newAttempts.toString());

        const response = await fetch("/api/donations/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            donorEmail,
            donorName,
            isRecurring,
            donationMessage,
            isAnonymous,
            organization: "protecting", // Always set to Protecting SF
            allowRecognition,
          }),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
        
        // Thank user for their support
        if (donationAttempts > 0) {
          toast({
            title: "Thank you for your continued support! 💙",
            description: `This is your ${newAttempts === 2 ? "2nd" : newAttempts === 3 ? "3rd" : newAttempts + "th"} donation attempt. We truly appreciate your dedication.`,
          });
        } else {
          toast({
            title: "Preparing your donation...",
            description: "Thank you for supporting Protecting San Francisco!",
          });
        }
      } catch (error) {
        console.error("Payment preparation error:", error);
        toast({
          title: "Error preparing payment",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset client secret when payment method changes
  useEffect(() => {
    setClientSecret("");
  }, [paymentMethod]);

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">
              Support Protecting San Francisco
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your donations help maintain this recruitment platform and support
              our mission to build a stronger, safer San Francisco.
              {currentUser && (
                <span className="block text-sm text-blue-600 mt-2">
                  Welcome back, {currentUser.name}! Thank you for being part of our community.
                </span>
              )}
            </p>
          </div>

          {/* Organization Information */}
          <div className="mb-10 bg-white rounded-lg border border-[#0A3C1F]/20 p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src="/protecting-sf-logo.png"
                  alt="Protecting San Francisco Logo"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-grow max-w-xl">
                <h2 className="text-xl font-bold text-[#0A3C1F] mb-2">
                  Protecting San Francisco
                </h2>
                <p className="text-gray-700">
                  Support the 501(c)3 charitable organization (tax-deductible) and
                  the charitable arm of the San Francisco Deputy Sheriffs&apos;
                  Association. Your contributions directly fund recruitment
                  initiatives, community outreach, and educational programs.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex-shrink-0">
                <Image
                  src="/sfdsa-logo.png"
                  alt="San Francisco Deputy Sheriffs' Association Logo"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-grow max-w-xl">
                <h2 className="text-xl font-bold text-[#0A3C1F] mb-2">
                  San Francisco Deputy Sheriffs&apos; Association
                </h2>
                <p className="text-gray-700">
                  The SFDSA is a 501(c)5 organization representing deputy
                  sheriffs. While the SFDSA does not accept donations directly, it
                  works closely with Protecting San Francisco to support
                  recruitment and community initiatives.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0A3C1F]/5 rounded-lg">
              <p className="text-center font-medium text-[#0A3C1F]">
                All donations made through this site are processed via Stripe and
                Venmo and are directed to Protecting San Francisco, a registered
                501(c)3 charitable organization.
              </p>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">501(c)3</div>
                <div className="text-sm text-gray-600 font-medium">Tax Deductible</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">$10+</div>
                <div className="text-sm text-gray-600 font-medium">Any Amount Helps</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Secure Processing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A3C1F]">100%</div>
                <div className="text-sm text-gray-600 font-medium">Transparent Use</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#0A3C1F] mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Related Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/donor-recognition">
                <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                  <Heart className="h-4 w-4 mr-2" />
                  Donor Recognition Wall
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link href="/volunteer-register">
                <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-800 hover:bg-blue-200">
                  <Users className="h-4 w-4 mr-2" />
                  Volunteer Application
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="bg-white border-[#0A3C1F]/20 col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Coffee className="h-8 w-8 text-[#0A3C1F]" />
                </div>
                <CardTitle className="text-xl text-[#0A3C1F]">
                  Small Gift
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-2">
                <p className="text-gray-600 mb-4">
                  Every contribution makes a difference, no matter the size.
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                    onClick={() => {
                      setDonationAmount("10");
                      setCustomAmount("");
                      toast({
                        title: "Amount selected",
                        description: "You&apos;ve selected a $10 donation",
                      });
                    }}
                  >
                    $10
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#0A3C1F]/20 col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <HandHeart className="h-8 w-8 text-[#0A3C1F]" />
                </div>
                <CardTitle className="text-xl text-[#0A3C1F]">
                  Supporter
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-2">
                <p className="text-gray-600 mb-4">
                  Help us reach more potential recruits with your support.
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                    onClick={() => {
                      setDonationAmount("25");
                      setCustomAmount("");
                      toast({
                        title: "Amount selected",
                        description: "You&apos;ve selected a $25 donation",
                      });
                    }}
                  >
                    $25
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#0A3C1F]/20 col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-[#0A3C1F]" />
                </div>
                <CardTitle className="text-xl text-[#0A3C1F]">Champion</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-2">
                <p className="text-gray-600 mb-4">
                  Make a significant impact on our recruitment initiatives.
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                    onClick={() => {
                      setDonationAmount("50");
                      setCustomAmount("");
                      toast({
                        title: "Amount selected",
                        description: "You&apos;ve selected a $50 donation",
                      });
                    }}
                  >
                    $50
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#0A3C1F]/20 col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-[#0A3C1F]/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Heart className="h-8 w-8 text-[#0A3C1F]" />
                </div>
                <CardTitle className="text-xl text-[#0A3C1F]">
                  Benefactor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-2">
                <p className="text-gray-600 mb-4">
                  Transform our ability to serve the community.
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                    onClick={() => {
                      setDonationAmount("100");
                      setCustomAmount("");
                      toast({
                        title: "Amount selected",
                        description: "You&apos;ve selected a $100 donation",
                      });
                    }}
                  >
                    $100
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="one-time" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="one-time" onClick={() => setIsRecurring(false)}>
                One-Time Donation
              </TabsTrigger>
              <TabsTrigger value="monthly" onClick={() => setIsRecurring(true)}>
                Monthly Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="one-time">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A3C1F]">
                    Make a One-Time Donation
                  </CardTitle>
                  <CardDescription>
                    Your donation will support the maintenance and improvement of
                    our recruitment platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!clientSecret ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="donation-amount">Donation Amount</Label>
                        <RadioGroup
                          defaultValue="10"
                          value={donationAmount}
                          onValueChange={(value) => {
                            setDonationAmount(value);
                            setCustomAmount("");
                          }}
                          className="grid grid-cols-4 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="10"
                              id="amount-10"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-10"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$10</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="25"
                              id="amount-25"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-25"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$25</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="50"
                              id="amount-50"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="amount-50"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$50</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="100"
                              id="amount-100"
                              className="peer sr-only"
                            />
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
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="custom-amount"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            className="pl-8"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setDonationAmount("");
                            }}
                          />
                        </div>
                      </div>

                      <DonationImpactDisplay
                        amount={donationAmount}
                        customAmount={customAmount}
                      />

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
                        <p className="text-xs text-gray-500">
                          We&apos;ll send your donation receipt to this email.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="anonymous"
                          className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <Label
                          htmlFor="anonymous"
                          className="text-sm font-normal"
                        >
                          Make my donation anonymous
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="checkbox"
                          id="allow-recognition"
                          className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                          checked={allowRecognition}
                          onChange={(e) => setAllowRecognition(e.target.checked)}
                        />
                        <Label
                          htmlFor="allow-recognition"
                          className="text-sm font-normal"
                        >
                          I would like my name to appear on the donor recognition
                          wall
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

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`border-2 rounded-md p-4 flex flex-col items-center cursor-pointer transition-colors ${
                              paymentMethod === "stripe"
                                ? "border-[#0A3C1F] bg-[#0A3C1F]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setPaymentMethod("stripe")}
                          >
                            <CreditCard className="h-8 w-8 mb-2 text-[#0A3C1F]" />
                            <span className="text-sm font-medium">
                              Credit Card
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Powered by Stripe
                            </span>
                          </div>
                          <div
                            className={`border-2 rounded-md p-4 flex flex-col items-center cursor-pointer transition-colors ${
                              paymentMethod === "venmo"
                                ? "border-[#3D95CE] bg-[#3D95CE]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setPaymentMethod("venmo")}
                          >
                            <svg
                              className="h-8 w-8 mb-2 text-[#3D95CE]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19.5955 2C20.5 2 21.5 2.5 21.9352 3.77148C22.1 4.5 22.1 5.5 21.9 6.60156L17.8 21.5C17.6 22.2 16.9 22.8 16.1 22.8H7.30005C6.70005 22.8 6.20005 22.3 6.20005 21.7C6.20005 21.6 6.20005 21.5 6.20005 21.4L10.4 6.60156C10.7 5.40156 11.7 4.60156 12.9 4.60156H19.6V2H19.5955ZM12.9 6.60156C12.4 6.60156 12 6.90156 11.9 7.40156L7.70005 22.2C7.70005 22.3 7.70005 22.3 7.80005 22.3C7.90005 22.3 7.90005 22.3 8.00005 22.3H16.1C16.3 22.3 16.5 22.1 16.6 21.9L20.7 7.00001C20.8 6.40001 20.8 5.80001 20.7 5.40001C20.6 5.00001 20.2 4.70001 19.7 4.70001H13L12.9 6.60156ZM3.00005 7.60156C2.40005 7.60156 1.90005 8.10156 1.90005 8.70156C1.90005 8.80156 1.90005 8.90156 1.90005 9.00156L4.70005 21.4C4.80005 22.1 5.40005 22.6 6.10005 22.6C6.70005 22.6 7.20005 22.1 7.20005 21.5C7.20005 21.4 7.20005 21.3 7.20005 21.2L4.40005 8.80156C4.30005 8.10156 3.70005 7.60156 3.00005 7.60156Z" />
                            </svg>
                            <span className="text-sm font-medium">Venmo</span>
                            <span className="text-xs text-gray-500 mt-1">
                              Quick mobile payment
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <DonationForm
                        amount={Number.parseFloat(amount)}
                        isRecurring={isRecurring}
                        onCancel={() => setClientSecret("")}
                      />
                    </Elements>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-red-500">
                        Stripe could not be initialized. Please check your
                        configuration.
                      </p>
                    </div>
                  )}
                </CardContent>

                {!clientSecret && (
                  <CardFooter className="flex justify-between pt-6 px-6">
                    {paymentMethod === "stripe" ? (
                      <Button
                        type="button"
                        className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white w-full"
                        disabled={
                          !donorEmail ||
                          (!donationAmount && !customAmount) ||
                          isLoading
                        }
                        onClick={handlePreparePayment}
                      >
                        {isLoading ? "Preparing..." : "Continue to Payment"}
                      </Button>
                    ) : (
                      <VenmoOption
                        amount={amount}
                        donorName={donorName}
                        donorEmail={donorEmail}
                        organization="protecting"
                      />
                    )}
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0A3C1F]">
                    Become a Monthly Supporter
                  </CardTitle>
                  <CardDescription>
                    Your recurring donation provides sustainable support for our
                    recruitment efforts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!clientSecret ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="monthly-amount">Monthly Amount</Label>
                        <RadioGroup
                          defaultValue="10"
                          value={donationAmount}
                          onValueChange={(value) => {
                            setDonationAmount(value);
                            setCustomAmount("");
                          }}
                          className="grid grid-cols-4 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="5"
                              id="monthly-5"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-5"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$5</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="10"
                              id="monthly-10"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-10"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$10</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="25"
                              id="monthly-25"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="monthly-25"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#0A3C1F] [&:has([data-state=checked])]:border-[#0A3C1F]"
                            >
                              <span>$25</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="50"
                              id="monthly-50"
                              className="peer sr-only"
                            />
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
                        <Label htmlFor="monthly-custom">
                          Custom Monthly Amount
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="monthly-custom"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            className="pl-8"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setDonationAmount("");
                            }}
                          />
                        </div>
                      </div>

                      <DonationImpactDisplay
                        amount={donationAmount}
                        customAmount={customAmount}
                      />

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
                        <p className="text-xs text-gray-500">
                          We&apos;ll send your donation receipts to this email.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="monthly-anonymous"
                          className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <Label
                          htmlFor="monthly-anonymous"
                          className="text-sm font-normal"
                        >
                          Make my donations anonymous
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="checkbox"
                          id="allow-recognition"
                          className="h-4 w-4 rounded border-gray-300 text-[#0A3C1F] focus:ring-[#0A3C1F]"
                          checked={allowRecognition}
                          onChange={(e) => setAllowRecognition(e.target.checked)}
                        />
                        <Label
                          htmlFor="allow-recognition"
                          className="text-sm font-normal"
                        >
                          I would like my name to appear on the donor recognition
                          wall
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthly-message">
                          Message (Optional)
                        </Label>
                        <textarea
                          id="monthly-message"
                          rows={3}
                          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Share why you're supporting us"
                          value={donationMessage}
                          onChange={(e) => setDonationMessage(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-1 gap-4">
                          <div
                            className={`border-2 rounded-md p-4 flex flex-col items-center cursor-pointer transition-colors border-[#0A3C1F] bg-[#0A3C1F]/5`}
                          >
                            <CreditCard className="h-8 w-8 mb-2 text-[#0A3C1F]" />
                            <span className="text-sm font-medium">
                              Credit Card
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Powered by Stripe
                            </span>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-2">
                            <p>
                              Recurring donations are only available via credit
                              card.
                            </p>
                            <p>
                              Venmo does not currently support automatic recurring
                              payments.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <DonationForm
                        amount={Number.parseFloat(amount)}
                        isRecurring={isRecurring}
                        onCancel={() => setClientSecret("")}
                      />
                    </Elements>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-red-500">
                        Stripe could not be initialized. Please check your
                        configuration.
                      </p>
                    </div>
                  )}
                </CardContent>

                {!clientSecret && (
                  <CardFooter className="flex justify-end pt-6 px-6">
                    <Button
                      type="button"
                      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white w-full"
                      disabled={
                        !donorEmail ||
                        (!donationAmount && !customAmount) ||
                        isLoading
                      }
                      onClick={handlePreparePayment}
                    >
                      {isLoading ? "Preparing..." : "Subscribe"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              <MonthlyImpactCalculator />
            </TabsContent>
          </Tabs>

          <div className="mt-12 bg-white rounded-lg border border-[#0A3C1F]/20 p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#0A3C1F] mb-6 text-center">
              Your Donation&apos;s Impact
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $10
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      Recruit Information Package
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Provides comprehensive information packages for 5 potential
                    recruits, including career guides, application checklists, and
                    preparation materials.
                  </p>
                </div>

                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $25
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      AI Assistant Improvements
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Helps enhance Sgt. Ken&apos;s AI capabilities with updated
                    information and improved response accuracy to better assist
                    potential recruits with their questions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $50
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      Community Outreach
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Supports a community outreach event to connect with diverse
                    neighborhoods and share information about careers in law
                    enforcement with underrepresented groups.
                  </p>
                </div>

                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $100
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      Recruitment Workshop
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Funds a recruitment workshop that provides hands-on training
                    for physical fitness tests, interview preparation, and written
                    exam strategies for up to 10 potential recruits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $250
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      Mentorship Program
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Supports our mentorship program that pairs experienced
                    deputies with recruits throughout the application process,
                    providing guidance and support for up to 5 recruits.
                  </p>
                </div>

                <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#0A3C1F] text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      $500+
                    </div>
                    <h3 className="font-semibold text-[#0A3C1F]">
                      Scholarship Support
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Contributes to our scholarship fund that helps promising
                    candidates with training costs, equipment, and educational
                    expenses as they prepare for a career in law enforcement.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 italic">
                Your donation of any amount makes a difference in our mission to
                build a stronger, more diverse Sheriff&apos;s Department for San
                Francisco.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-[#0A3C1F]/5 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#0A3C1F] mb-4">Our Mission</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Users className="h-5 w-5 text-[#0A3C1F]" />
                </div>
                <div>
                  <h3 className="font-medium">Diverse Recruitment</h3>
                  <p className="text-gray-600 text-sm">
                    We&apos;re committed to building a Sheriff&apos;s Department
                    that reflects the diversity of San Francisco, recruiting
                    qualified candidates from all communities.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <BookOpen className="h-5 w-5 text-[#0A3C1F]" />
                </div>
                <div>
                  <h3 className="font-medium">Education & Preparation</h3>
                  <p className="text-gray-600 text-sm">
                    We provide resources, training, and mentorship to help
                    candidates prepare for a successful career in law enforcement.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Building className="h-5 w-5 text-[#0A3C1F]" />
                </div>
                <div>
                  <h3 className="font-medium">Community Connection</h3>
                  <p className="text-gray-600 text-sm">
                    We foster stronger connections between the Sheriff&apos;s
                    Department and the communities it serves through outreach and
                    education.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Star className="h-5 w-5 text-[#0A3C1F]" />
                </div>
                <div>
                  <h3 className="font-medium">Excellence in Service</h3>
                  <p className="text-gray-600 text-sm">
                    We support initiatives that promote the highest standards of
                    professionalism, integrity, and service within the
                    Sheriff&apos;s Department.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Protecting San Francisco is a 501(c)(3) non-profit organization. All
              donations are tax-deductible.
            </p>
            <p className="text-sm text-gray-500">Tax ID: 12-3456789</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
