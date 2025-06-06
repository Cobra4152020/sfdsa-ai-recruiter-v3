import type { Metadata } from "next";
import { DonorRecognitionWall } from "@/components/donor-recognition-wall";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata: Metadata = {
  title: "Donor Recognition Wall | SF Deputy Sheriff Recruitment",
  description:
    "Recognizing the generous supporters who make our mission possible. Thank you to our community of donors supporting the San Francisco Sheriff's Office.",
  keywords:
    "donor recognition, support SF sheriff, donations, community supporters, San Francisco law enforcement",
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
