import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation Management | Admin Dashboard",
  description:
    "Manage and track donations to the SF Deputy Sheriff's Association.",
};

export default function DonationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
