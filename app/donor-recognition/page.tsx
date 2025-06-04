import type { Metadata } from "next";
import { DonorRecognitionWall } from "@/components/donor-recognition-wall";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata: Metadata = {
  title: "Donor Recognition | Protecting San Francisco",
  description:
    "Recognizing the generous supporters who make our mission possible.",
};

export default function DonorRecognitionPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <DonorRecognitionWall />
      </div>
    </PageWrapper>
  );
}
