import LaunchpadContent from "./content";
import { PageWrapper } from "@/components/page-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deputy Launchpad | SF Deputy Sheriff Recruitment",
  description:
    "Earn points, unlock badges, and track your progress toward becoming a San Francisco Deputy Sheriff.",
  keywords:
    "deputy sheriff, recruitment, points system, badges, rewards, law enforcement career",
};

export default function DeputyLaunchpadPage() {
  return (
    <PageWrapper>
      <div className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
        <LaunchpadContent />
      </div>
    </PageWrapper>
  );
} 