"use client";

import { PointsGate } from "@/components/points-gate";
import DiscountedHousingContent from "./content";

export default function DiscountedHousingClient() {
  return (
    <PointsGate
      requiredPoints={500}
      pageName="Discounted Housing Programs"
      pageDescription="Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs. Find affordable housing options in and around San Francisco."
      imageUrl="/san-francisco-apartments.png"
      fallbackMessage="Sign up to access information about discounted housing programs for San Francisco Deputy Sheriffs."
    >
      <DiscountedHousingContent />
    </PointsGate>
  );
}
