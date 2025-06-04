import type { Metadata } from "next";
import UserBadgeClient from "./user-badge-client";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { notFound } from "next/navigation";
import { getBadgeById } from "@/lib/badge-utils";

interface UserBadgePageProps {
  params: {
    id: string;
  };
}

// Pre-generate pages for common names and test cases
export async function generateStaticParams() {
  // Add common names and test cases
  const commonNames = [
    "John-Doe",
    "Jane-Doe",
    "Test-User",
    "Demo-User",
    "Sample-User",
    "Recruit-Candidate",
  ];

  // Add badge types
  const badgeTypes = [
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full-process",
    "chat-participation",
    "application-started",
    "application-completed",
    "first-response",
    "frequent-user",
    "resource-downloader",
  ];

  // Verify each badge exists before adding it
  const validBadgeTypes = await Promise.all(
    badgeTypes.map(async (type) => {
      const badge = await getBadgeById(type);
      return badge ? type : null;
    }),
  );

  return [...commonNames, ...validBadgeTypes.filter(Boolean)].map((id) => ({
    id: id as string,
  }));
}

export async function generateMetadata({
  params,
}: UserBadgePageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.id);
  const badge = await getBadgeById(decodedName);

  // If it's a badge ID, use badge metadata
  if (badge) {
    return {
      title: `${badge.name} - SF Deputy Sheriff Badge Progress`,
      description: badge.description,
      openGraph: {
        title: `${badge.name} - SF Deputy Sheriff Badge Progress`,
        description: badge.description,
        images: [
          {
            url: badge.icon || "/generic-badge.png",
            width: 1200,
            height: 1200,
            alt: badge.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${badge.name} - SF Deputy Sheriff Badge Progress`,
        description: badge.description,
        images: [badge.icon || "/generic-badge.png"],
      },
    };
  }

  // Otherwise use user-specific metadata
  return {
    title: `${decodedName}&apos;s SF Deputy Sheriff Recruitment Badge`,
    description: `${decodedName} is exploring a career with the San Francisco Sheriff&apos;s Office. Join them and discover opportunities in law enforcement!`,
    openGraph: {
      title: `${decodedName}&apos;s SF Deputy Sheriff Recruitment Badge`,
      description: `${decodedName} is exploring a career with the San Francisco Sheriff&apos;s Office. Join them and discover opportunities in law enforcement!`,
      images: [
        {
          url: "/recruitment-badge.png",
          width: 1200,
          height: 1200,
          alt: `${decodedName}&apos;s SF Deputy Sheriff Recruitment Badge`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedName}&apos;s SF Deputy Sheriff Recruitment Badge`,
      description: `${decodedName} is exploring a career with the San Francisco Sheriff&apos;s Office. Join them and discover opportunities in law enforcement!`,
      images: ["/recruitment-badge.png"],
    },
  };
}

export default async function UserBadgePage({ params }: UserBadgePageProps) {
  const decodedId = decodeURIComponent(params.id);
  const badge = await getBadgeById(decodedId);

  // If neither a valid badge nor a valid username format, show 404
  if (!badge && !/^[a-zA-Z0-9-]+$/.test(decodedId)) {
    notFound();
  }

  return (
    <AuthModalProvider>
      <UserBadgeClient id={decodedId} badge={badge} />
    </AuthModalProvider>
  );
}
