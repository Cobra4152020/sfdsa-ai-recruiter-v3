"use client"

import { useState, useEffect } from "react"
import { UserProfileCard } from "@/components/user-profile-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { SkipToContent } from "@/components/skip-to-content"

interface ProfilePageClientProps {
  params: {
    id: string
  }
}

export function ProfilePageClient({ params }: ProfilePageClientProps) {
  const userId = params.id
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/profile`)
        const data = await response.json()

        if (data.success && data.profile) {
          setUserName(data.profile.name)
        }
      } catch (error) {
        console.error("Error fetching user name:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserName()
  }, [userId])

  // Meta tags for social sharing
  const title = userName ? `${userName}'s Profile - SF Sheriff Recruitment` : "User Profile - SF Sheriff Recruitment"
  const description = userName
    ? `Check out ${userName}'s profile on the San Francisco Sheriff's Office recruitment platform.`
    : "View this user's profile on the San Francisco Sheriff's Office recruitment platform."

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
        </head>

        <SkipToContent />
        <ImprovedHeader showOptInForm={() => {}} />

        <main id="main-content" className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <Link href="/awards" prefetch={false}>
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leaderboard
              </Button>
            </Link>

            <div className="max-w-3xl mx-auto">
              <UserProfileCard userId={userId} isExpanded={true} />
            </div>
          </div>
        </main>

        <ImprovedFooter />
      </div>
    </UserProvider>
  )
} 