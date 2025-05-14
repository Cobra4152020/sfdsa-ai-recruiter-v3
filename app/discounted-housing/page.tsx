import type { Metadata } from "next"
import { PointsGate } from "@/components/points-gate"
import DiscountedHousingContent from "./content"

export const metadata: Metadata = {
  title: "Discounted Housing | SF Deputy Sheriff Recruitment",
  description:
    "Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs. Find affordable housing options in and around San Francisco.",
  keywords:
    "deputy sheriff housing, law enforcement housing programs, affordable housing San Francisco, first responder housing",
}

export default function DiscountedHousingPage() {
  return (
    <PointsGate
      requiredPoints={300}
      pageName="Discounted Housing Programs"
      pageDescription="Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs."
      imageUrl="/san-francisco-apartments.png"
    >
      <DiscountedHousingContent />
    </PointsGate>
  )
}
