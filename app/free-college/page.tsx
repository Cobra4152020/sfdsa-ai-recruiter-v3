import type { Metadata } from "next";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { PageWrapper } from "@/components/page-wrapper";
import FreeCollegeContent from "./content";

export const metadata: Metadata = {
  title: "Free College Programs | SF Deputy Sheriff Recruitment",
  description:
    "Discover free college and continuing education programs available to San Francisco Deputy Sheriffs. Learn about tuition assistance, reimbursement programs, and educational benefits.",
  keywords:
    "free college, deputy sheriff education, tuition assistance, continuing education, law enforcement training, educational benefits San Francisco",
};

export default function FreeCollegePage() {
  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="locked_content"
        minimumPoints={250}
        title="Free College Programs"
        description="Discover free college and continuing education programs available to San Francisco Deputy Sheriffs."
        heroImage="/ccsf_frontpg.jpg"
      >
        <FreeCollegeContent />
      </AuthRequiredWrapper>
    </PageWrapper>
  );
} 