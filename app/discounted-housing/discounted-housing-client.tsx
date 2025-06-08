"use client";

import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { PageWrapper } from "@/components/page-wrapper";
import DiscountedHousingContent from "./content";

export default function DiscountedHousingClient() {
  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="locked_content"
        minimumPoints={500}
        title="Discounted Housing Programs"
        description="Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs. Find affordable housing options in and around San Francisco."
        heroImage="/san-francisco-apartments.png"
      >
        <DiscountedHousingContent />
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}
