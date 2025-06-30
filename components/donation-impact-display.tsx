"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface DonationImpactDisplayProps {
  amount: string | number;
  customAmount: string;
}

export function DonationImpactDisplay({
  amount,
  customAmount,
}: DonationImpactDisplayProps) {
  const [impact, setImpact] = useState<string>("");
  const [secondaryImpact, setSecondaryImpact] = useState<string>("");

  useEffect(() => {
    const donationAmount = customAmount
      ? Number.parseFloat(customAmount)
      : Number.parseFloat(amount as string);

    if (isNaN(donationAmount) || donationAmount <= 0) {
      setImpact("");
      setSecondaryImpact("");
      return;
    }

    // Set primary impact
    if (donationAmount < 10) {
      setImpact("Provides information materials for a potential recruit");
    } else if (donationAmount < 25) {
      setImpact(
        "Provides comprehensive information packages for 5 potential recruits",
      );
    } else if (donationAmount < 50) {
      setImpact(
        "Helps enhance Sgt. Ken's AI capabilities with updated information",
      );
    } else if (donationAmount < 100) {
      setImpact("Supports a community outreach event in diverse neighborhoods");
    } else if (donationAmount < 250) {
      setImpact("Funds a recruitment workshop for up to 10 potential recruits");
    } else if (donationAmount < 500) {
      setImpact("Supports our mentorship program for up to 5 recruits");
    } else {
      setImpact("Contributes to our scholarship fund for promising candidates");
    }

    // Set secondary impact based on amount ranges
    if (donationAmount >= 25 && donationAmount < 50) {
      setSecondaryImpact(
        "Also provides information packages for 10+ potential recruits",
      );
    } else if (donationAmount >= 50 && donationAmount < 100) {
      setSecondaryImpact("Also helps improve our AI assistant capabilities");
    } else if (donationAmount >= 100 && donationAmount < 250) {
      setSecondaryImpact(
        "Also supports multiple community outreach initiatives",
      );
    } else if (donationAmount >= 250) {
      setSecondaryImpact(
        "Also funds multiple recruitment workshops and outreach events",
      );
    } else {
      setSecondaryImpact("");
    }
  }, [amount, customAmount]);

  if (!impact) return null;

  return (
    <div className="mt-4 bg-primary/5 p-4 rounded-lg">
      <h3 className="font-semibold text-primary mb-2">
        Your Donation Impact:
      </h3>
      <div className="flex items-start mb-1">
        <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700">{impact}</p>
      </div>
      {secondaryImpact && (
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">{secondaryImpact}</p>
        </div>
      )}
    </div>
  );
}
