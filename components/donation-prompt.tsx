"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Coffee } from "lucide-react"
import Link from "next/link"

interface DonationPromptProps {
  className?: string
  variant?: "inline" | "card"
}

export function DonationPrompt({ className = "", variant = "inline" }: DonationPromptProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  if (variant === "card") {
    return (
      <div className={`bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 ${className}`}>
        <div className="flex items-start">
          <div className="bg-[#FFD700]/30 p-2 rounded-full mr-3">
            <Coffee className="h-5 w-5 text-[#0A3C1F]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[#0A3C1F]">Support Sgt. Ken</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you appreciate this site and my assistance, consider buying me a coffee! Your donation helps maintain
              this platform.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/donate">
                <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                  Donate Now
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F]"
                onClick={() => setDismissed(true)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p className="text-sm text-gray-600">
        <Coffee className="h-4 w-4 text-[#0A3C1F] inline-block mr-1" />
        If you appreciate my assistance, consider{" "}
        <Link href="/donate" className="text-[#0A3C1F] font-medium hover:underline">
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
  )
}
