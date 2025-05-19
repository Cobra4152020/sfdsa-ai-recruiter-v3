"use client"

import { PointsGate } from "@/components/points-gate"
import DiscountedHousingContent from "./content"

export default function DiscountedHousingClient() {
  return (
    <PointsGate
      requiredPoints={300}
      fallbackMessage="Sign up to access information about discounted housing programs for San Francisco Deputy Sheriffs."
    >
      <DiscountedHousingContent />
    </PointsGate>
  )
} 