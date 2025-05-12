import type { Metadata } from "next"
import { DonorRecognitionWall } from "@/components/donor-recognition-wall"
import { PageWrapper } from "@/components/page-wrapper"

export const metadata: Metadata = {
  title: "Donor Recognition | Protecting San Francisco",
  description: "Recognizing the generous supporters who make our mission possible.",
}

export default async function DonorRecognitionPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">Our Generous Supporters</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are deeply grateful to the individuals and organizations whose generous support makes our mission
              possible. The following donors have given permission to be recognized for their contributions.
            </p>
          </div>

          <DonorRecognitionWall />
        </div>
      </div>
    </PageWrapper>
  )
}
