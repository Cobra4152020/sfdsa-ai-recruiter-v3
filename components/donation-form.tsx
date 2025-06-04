"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getDonationPointRules } from "@/lib/donation-points-service";

interface DonationFormProps {
  amount: number;
  isRecurring: boolean;
  onCancel?: () => void;
}

export function DonationForm({
  amount,
  isRecurring,
  onCancel,
}: DonationFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [allowRecognition, setAllowRecognition] = useState(false);
  const [pointsEstimate, setPointsEstimate] = useState<number | null>(null);

  useEffect(() => {
    // Calculate points estimate
    const calculatePoints = async () => {
      try {
        const result = await getDonationPointRules();
        if (result.success && result.rules) {
          // Find applicable rule
          const rule = result.rules.find(
            (r) =>
              r.isActive &&
              r.minAmount <= amount &&
              (r.maxAmount === null || r.maxAmount >= amount),
          );

          if (rule) {
            const basePoints = Math.floor(amount * rule.pointsPerDollar);
            const multiplier = isRecurring ? rule.recurringMultiplier : 1;
            setPointsEstimate(Math.floor(basePoints * multiplier));
          } else {
            // Default calculation if no rule applies
            const basePoints = Math.floor(amount * 10); // Default 10 points per dollar
            const multiplier = isRecurring ? 1.5 : 1; // Default 1.5x for recurring
            setPointsEstimate(Math.floor(basePoints * multiplier));
          }
        }
      } catch (error) {
        console.error("Error calculating points estimate:", error);
      }
    };

    calculatePoints();
  }, [amount, isRecurring]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe has not been properly initialized.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/thank-you`,
        },
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
        setIsLoading(false);
      }
      // If successful, the page will redirect to the return_url
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setMessage((err as Error).message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Donation</CardTitle>
        <CardDescription>
          {isRecurring
            ? `You&apos;re setting up a monthly donation of $${amount}`
            : `You&apos;re making a one-time donation of $${amount}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement id="payment-element" />

          {pointsEstimate !== null && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Points you&apos;ll earn:
                </span>
                <Badge variant="secondary" className="text-[#0A3C1F]">
                  {pointsEstimate.toLocaleString()} points
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isRecurring
                  ? "You&apos;ll earn these points each month with your recurring donation!"
                  : "Earn points with your donation to unlock badges and rewards!"}
              </p>
            </div>
          )}

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

          {message && (
            <div className="text-sm text-red-500 mt-4">{message}</div>
          )}

          <div className="flex justify-between mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              className={onCancel ? "" : "w-full"}
            >
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
  );
}
