import type { Metadata } from "next"
import { UserBadgeClient } from "./user-badge-client"
import { AuthModalProvider } from "@/context/auth-modal-context"

interface UserBadgePageProps {
  params: {
    id: string
  }
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
    "written",
    "oral",
    "physical",
    "polygraph",
    "psychological",
    "full",
    "chat-participation",
    "application-started",
    "application-completed",
    "first-response",
    "frequent-user",
    "resource-downloader"
  ]

  return commonNames.map((name) => ({
    id: name,
  }))
}

export async function generateMetadata({ params }: UserBadgePageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.id)

  return {
    title: `${decodedName}'s SF Deputy Sheriff Recruitment Badge`,
    description: `${decodedName} is exploring a career with the San Francisco Sheriff's Office. Join them and discover opportunities in law enforcement!`,
    openGraph: {
      title: `${decodedName}'s SF Deputy Sheriff Recruitment Badge`,
      description: `${decodedName} is exploring a career with the San Francisco Sheriff's Office. Join them and discover opportunities in law enforcement!`,
      images: [
        {
          url: "/recruitment-badge.png",
          width: 1200,
          height: 1200,
          alt: `${decodedName}'s SF Deputy Sheriff Recruitment Badge`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedName}'s SF Deputy Sheriff Recruitment Badge`,
      description: `${decodedName} is exploring a career with the San Francisco Sheriff's Office. Join them and discover opportunities in law enforcement!`,
      images: ["/recruitment-badge.png"],
    },
  }
}

export default function UserBadgePage({ params }: UserBadgePageProps) {
  return (
    <AuthModalProvider>
      <UserBadgeClient id={params.id} />
    </AuthModalProvider>
  )
}
