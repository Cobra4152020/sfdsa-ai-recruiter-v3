import type React from "react";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata: Metadata = {
  title: "User Dashboard | SF Deputy Sheriff Recruitment",
  description:
    "Manage your recruitment journey and track your progress with the San Francisco Sheriff&apos;s Office.",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageWrapper>
      <main className="flex-1 bg-[#F8F5EE] dark:bg-black pt-20">
        {children}
      </main>
    </PageWrapper>
  );
}
