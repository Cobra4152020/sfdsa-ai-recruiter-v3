import type { Metadata } from "next"
import DiscountedHousingClient from "./discounted-housing-client"

export const metadata: Metadata = {
  title: "Discounted Housing | SF Deputy Sheriff Recruitment",
  description:
    "Learn about special housing programs and discounts available to San Francisco Deputy Sheriffs. Find affordable housing options in and around San Francisco.",
  keywords:
    "deputy sheriff housing, law enforcement housing programs, affordable housing San Francisco, first responder housing",
}

export default function DiscountedHousingPage() {
  return <DiscountedHousingClient />
}
