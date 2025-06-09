"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function MonthlyImpactCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(25);
  const [yearlyTotal, setYearlyTotal] = useState(300);
  const [impact, setImpact] = useState("");

  useEffect(() => {
    setYearlyTotal(monthlyAmount * 12);

    // Determine impact based on yearly total
    if (yearlyTotal < 120) {
      setImpact(
        "Provides information packages for up to 30 potential recruits over a year",
      );
    } else if (yearlyTotal < 300) {
      setImpact(
        "Supports AI assistant improvements and community outreach events throughout the year",
      );
    } else if (yearlyTotal < 600) {
      setImpact(
        "Funds multiple recruitment workshops and mentorship opportunities for up to 20 recruits annually",
      );
    } else if (yearlyTotal < 1200) {
      setImpact(
        "Enables a comprehensive mentorship program and contributes to our scholarship fund",
      );
    } else {
      setImpact(
        "Makes a significant contribution to our scholarship fund and supports all our recruitment initiatives",
      );
    }
  }, [monthlyAmount, yearlyTotal]);

  return (
    <Card className="border-primary/20 mt-8">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Your Monthly Impact Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Monthly Impact Score:</span>
            <span className="font-semibold text-primary">
              {Math.round(yearlyTotal / 1000)} points
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Yearly Total Impact:</span>
            <span className="font-semibold text-2xl text-primary">
              {Math.round(yearlyTotal / 1000 * 12).toLocaleString()} points
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
