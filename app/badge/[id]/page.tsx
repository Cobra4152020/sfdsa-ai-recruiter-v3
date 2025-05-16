import type { Metadata } from "next"
import { getBadgeById, getAllBadgeIds } from "@/lib/badge-utils"
import { BadgeClient } from "./badge-client"
import { AuthModalProvider } from "@/context/auth-modal-context"

interface BadgePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BadgePageProps): Promise<Metadata> {
  const badge = await getBadgeById(params.id)

  return {
    title: badge ? `${badge.name} - SF Deputy Sheriff Badge` : "SF Deputy Sheriff Badge",
    description: badge
      ? badge.description
      : "View this badge from the San Francisco Sheriff's Office recruitment program",
    openGraph: {
      title: badge ? `${badge.name} - SF Deputy Sheriff Badge` : "SF Deputy Sheriff Badge",
      description: badge
        ? badge.description
        : "View this badge from the San Francisco Sheriff's Office recruitment program",
      images: [
        {
          url: badge?.icon || "/generic-badge.png",
          width: 1200,
          height: 1200,
          alt: badge?.name || "SF Deputy Sheriff Badge",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: badge ? `${badge.name} - SF Deputy Sheriff Badge` : "SF Deputy Sheriff Badge",
      description: badge
        ? badge.description
        : "View this badge from the San Francisco Sheriff's Office recruitment program",
      images: [badge?.icon || "/generic-badge.png"],
    },
  }
}

export async function generateStaticParams() {
  const badgeIds = await getAllBadgeIds()
  return badgeIds.map((id) => ({
    id: id,
  }))
}

export default async function BadgePage({ params }: BadgePageProps) {
  const badge = await getBadgeById(params.id)
  
  return (
    <AuthModalProvider>
      <BadgeClient badge={badge} />
    </AuthModalProvider>
  )
}
