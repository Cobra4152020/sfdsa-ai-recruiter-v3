"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import Link from "next/link";

interface DonationPromptProps {
  className?: string;
  variant?: "inline" | "card";
}

export function DonationPrompt({
  className = "",
  variant = "inline",
}: DonationPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-accent/20 border border-accent rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center">
          <div className="bg-accent/30 p-2 rounded-full mr-3">
            <Coffee className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-primary">Support Sgt. Ken</h3>
            <p className="text-sm text-muted-foreground">
              Help support our mission
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Donate Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-primary text-primary"
            onClick={() => setDismissed(true)}
          >
            Maybe Later
          </Button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <Coffee className="h-4 w-4 text-primary inline-block mr-1" />
          Want to make a bigger impact?{" "}
          <Link
            href="/donate"
            className="text-primary font-medium hover:underline"
          >
            View donor tiers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p className="text-sm text-gray-600">
        <Coffee className="h-4 w-4 text-primary inline-block mr-1" />
        If you appreciate my assistance, consider{" "}
        <Link
          href="/donate"
          className="text-primary font-medium hover:underline"
        >
          buying me a coffee!
        </Link>
      </p>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 px-2 text-gray-400 hover:text-gray-500"
        onClick={() => setDismissed(true)}
      >
        ✕
      </Button>
    </div>
  );
}
