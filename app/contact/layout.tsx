import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SF Deputy Sheriff Recruitment",
  description: "Have questions about joining the San Francisco Sheriff's Department? Contact our recruitment team for personalized assistance with the application process.",
  keywords: "contact SF sheriff, recruitment questions, deputy sheriff application help, San Francisco law enforcement contact",
  openGraph: {
    title: "Contact SF Deputy Sheriff Recruitment Team",
    description: "Get answers to your questions about becoming a deputy sheriff in San Francisco",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 