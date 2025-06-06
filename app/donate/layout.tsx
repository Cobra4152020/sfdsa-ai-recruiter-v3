import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate to Protecting San Francisco | SF Deputy Sheriff Recruitment",
  description: "Support our 501(c)(3) charitable organization that funds recruitment initiatives, community outreach, and educational programs for the San Francisco Sheriff's Department.",
  keywords: "donate San Francisco sheriff, Protecting SF donation, law enforcement charity, tax deductible donation, deputy sheriff support",
  openGraph: {
    title: "Donate to Protecting San Francisco",
    description: "Support recruitment and community programs for the SF Sheriff's Department",
    type: "website",
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
