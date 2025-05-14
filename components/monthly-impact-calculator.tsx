"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export function MonthlyImpactCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(25)
  const [yearlyTotal, setYearlyTotal] = useState(300)
  const [impact, setImpact] = useState("")

  useEffect(() => {
    setYearlyTotal(monthlyAmount * 12)

    // Determine impact based on yearly total
    if (yearlyTotal < 120) {
      setImpact("Provides information packages for up to 30 potential recruits over a year")
    } else if (yearlyTotal < 300) {
      setImpact("Supports AI assistant improvements and community outreach events throughout the year")
    } else if (yearlyTotal < 600) {
      setImpact("Funds multiple recruitment workshops and mentorship opportunities for up to 20 recruits annually")
    } else if (yearlyTotal < 1200) {
      setImpact("Enables a comprehensive mentorship program and contributes to our scholarship fund")
    } else {
      setImpact("Makes a significant contribution to our scholarship fund and supports all our recruitment initiatives")
    }
  }, [monthlyAmount, yearlyTotal])

  return (
    <Card className="border-[#0A3C1F]/20 mt-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#0A3C1F]">See Your Annual Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="monthly-impact">Monthly Donation: ${monthlyAmount}</Label>
              <span className="font-semibold text-[#0A3C1F]">Yearly Total: ${yearlyTotal}</span>
            </div>
            <Slider
              id="monthly-impact"
              min={5}
              max={100}
              step={5}
              value={[monthlyAmount]}
              onValueChange={(value) => setMonthlyAmount(value[0])}
              className="py-4"
            />
          </div>

          <div className="bg-[#0A3C1F]/5 p-4 rounded-lg">
            <h3 className="font-semibold text-[#0A3C1F] mb-2">Your Annual Impact:</h3>
            <p className="text-sm text-gray-700">{impact}</p>
          </div>

          <div className="text-center text-sm text-gray-600 italic">
            <p>
              Monthly donations provide sustainable support that allows Protecting San Francisco to plan long-term
              initiatives.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
