import { DeputySheriffRoadmap } from "@/components/deputy-sheriff-roadmap";
import { PageWrapper } from "@/components/page-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deputy Sheriff Roadmap | SF Deputy Sheriff Recruitment",
  description:
    "Follow your personalized journey to becoming a San Francisco Deputy Sheriff. Complete activities, earn points, and unlock new content and opportunities.",
  keywords:
    "deputy sheriff roadmap, recruitment journey, career path, law enforcement training, SF sheriff, police career progression",
};

export default function RoadmapPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <DeputySheriffRoadmap />
      </div>
    </PageWrapper>
  );
} 