"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Calculator } from "lucide-react";
import {
  type DonationPointRule,
  getDonationPointRules,
} from "@/lib/donation-points-service";

export function DonationPointsCalculator() {
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  // const [isCalculating, setIsCalculating] = useState(false);
  const [rules, setRules] = useState<DonationPointRule[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  useEffect(() => {
    const fetchRules = async () => {
      const result = await getDonationPointRules();
      if (result.success && result.rules) {
        setRules(result.rules);
      }
    };

    fetchRules();
  }, []);

  useEffect(() => {
    if (rules.length > 0 && donationAmount > 0) {
      calculatePoints();
    }
  }, [donationAmount, isRecurring, rules]);

  const calculatePoints = () => {
    // Find applicable rule
    const rule = rules.find(
      (r) =>
        r.isActive &&
        r.minAmount <= donationAmount &&
        (r.maxAmount === null || r.maxAmount >= donationAmount),
    );

    if (rule) {
      const basePoints = Math.floor(donationAmount * rule.pointsPerDollar);
      const multiplier = isRecurring ? rule.recurringMultiplier : 1;
      setPointsEarned(Math.floor(basePoints * multiplier));
    } else {
      // Default calculation if no rule applies
      const basePoints = Math.floor(donationAmount * 10); // Default 10 points per dollar
      const multiplier = isRecurring ? 1.5 : 1; // Default 1.5x for recurring
      setPointsEarned(Math.floor(basePoints * multiplier));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Points Calculator</CardTitle>
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          See how many points you&apos;ll earn for your donation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="donation-amount">Donation Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="donation-amount"
                type="number"
                min="1"
                step="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring">Recurring monthly donation</Label>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Points you&apos;ll earn:
              </span>
              <span className="text-2xl font-bold text-primary">
                {pointsEarned.toLocaleString()}
              </span>
            </div>
            {isRecurring && (
              <p className="text-xs text-muted-foreground mt-1">
                Recurring donations earn bonus points each month!
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                You&apos;ll earn approximately{" "}
                <span className="font-semibold text-primary">
                  {pointsEarned.toLocaleString()} points
                </span>{" "}
                with this donation
                {isRecurring && (
                  <span> each month (includes recurring bonus!)</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
