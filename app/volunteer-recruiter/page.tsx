import type { Metadata } from "next"
import { PageWrapper } from "@/components/page-wrapper"
import { VolunteerRecruiterSystem } from "@/components/volunteer-recruiter-system"

export const metadata: Metadata = {
  title: "Volunteer Recruiter Portal | SF Deputy Sheriff Recruitment",
  description:
    "Join our volunteer recruitment team and help build the future of the San Francisco Sheriff's Department.",
}

export default function VolunteerRecruiterPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-10">
        <VolunteerRecruiterSystem />
      </div>
    </PageWrapper>
  )
}
