import type { Metadata } from "next";
import { PageWrapper } from "@/components/page-wrapper";
import { VolunteerRecruiterSystem } from "@/components/volunteer-recruiter-system";

export const metadata: Metadata = {
  title: "Volunteer Recruiter Portal | SF Deputy Sheriff Recruitment",
  description:
    "Access your volunteer recruiter dashboard, generate referral links, contact potential candidates, and track your recruitment performance. Help build the future of the San Francisco Sheriff's Department.",
  keywords:
    "volunteer recruiter, SF sheriff recruitment, referral dashboard, law enforcement recruitment, San Francisco deputy sheriff volunteers",
  openGraph: {
    title: "Volunteer Recruiter Portal | SF Deputy Sheriff",
    description: "Professional tools for volunteer recruiters to help grow the San Francisco Sheriff's Department team.",
    type: "website",
  },
};

export default function VolunteerRecruiterPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-10">
        <VolunteerRecruiterSystem />
      </div>
    </PageWrapper>
  );
}
