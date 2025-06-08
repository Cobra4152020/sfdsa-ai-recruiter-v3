import type { Metadata } from "next";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { PageWrapper } from "@/components/page-wrapper";
import GIBillContent from "./content";

export const metadata: Metadata = {
  title: "G.I. Bill Benefits | SF Deputy Sheriff Recruitment",
  description:
    "Learn how to use your G.I. Bill benefits to fund your training and education as a San Francisco Deputy Sheriff. Comprehensive guide for veterans.",
  keywords:
    "G.I. Bill, veterans benefits, military to law enforcement, deputy sheriff training, education benefits",
};

export default function GIBillPage() {
  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="locked_content"
        minimumPoints={300}
        title="G.I. Bill Benefits"
        description="Learn how to use your G.I. Bill benefits to fund your training and education as a San Francisco Deputy Sheriff."
        heroImage="/veterans-law-enforcement-training.png"
      >
        <GIBillContent />
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}
