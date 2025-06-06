import type { Metadata } from "next";
import { getBadgeById, getAllBadgeIds } from "@/lib/badge-utils";
import { BadgeClient } from "./badge-client";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { notFound } from "next/navigation";
import type { BadgeWithProgress } from "@/types/badge";

interface BadgePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: BadgePageProps): Promise<Metadata> {
  const badge = await getBadgeById(params.id);

  if (!badge) {
    return {
      title: "Badge Not Found - SF Deputy Sheriff",
      description: "This badge could not be found.",
    };
  }

  return {
    title: `${badge.name} - SF Deputy Sheriff Badge`,
    description: badge.description,
    openGraph: {
      title: `${badge.name} - SF Deputy Sheriff Badge`,
      description: badge.description,
      images: [
        {
          url: badge.imageUrl || "/generic-badge.png",
          width: 1200,
          height: 1200,
          alt: badge.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${badge.name} - SF Deputy Sheriff Badge`,
      description: badge.description,
      images: [badge.imageUrl || "/generic-badge.png"],
    },
  };
}

export async function generateStaticParams() {
  const badgeIds = await getAllBadgeIds();
  return badgeIds.map((id) => ({
    id: id,
  }));
}

export default async function BadgePage({ params }: BadgePageProps) {
  const badge = await getBadgeById(params.id);

  if (!badge) {
    notFound();
  }

  // Convert Badge to BadgeWithProgress
  const badgeWithProgress: BadgeWithProgress = {
    ...badge,
    progress: 0,
    isUnlocked: false,
    currentTier: 1,
    xpEarned: 0,
  };

  return (
    <AuthModalProvider>
      <BadgeClient badge={badgeWithProgress} />
    </AuthModalProvider>
  );
}
