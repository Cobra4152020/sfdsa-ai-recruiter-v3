import MissionBriefingContent from "./content";
import { PageWrapper } from "@/components/page-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Briefing | SF Deputy Sheriff Recruitment",
  description:
    "Learn about the San Francisco Deputy Sheriff role, requirements, benefits, and application process.",
  keywords:
    "deputy sheriff, mission briefing, benefits, recruitment, law enforcement career, San Francisco",
};

export default function MissionBriefingPage() {
  return (
    <PageWrapper>
      <MissionBriefingContent />
    </PageWrapper>
  );
}
