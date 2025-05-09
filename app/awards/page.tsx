"use client"

import { useState, useEffect } from "react"
import { AdvancedLeaderboard } from "@/components/advanced-leaderboard"
import { ShareToUnlock } from "@/components/share-to-unlock"
import { ReferRecruiter } from "@/components/refer-recruiter"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { useUser } from "@/context/user-context"
import { TopRecruitsScroll } from "@/components/top-recruits-scroll"

export default function AwardsPage() {
  const [mounted, setMounted] = useState(false)
  const { currentUser } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">Top Recruit Awards</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Recognize outstanding achievement in our recruitment program. Like, share, and refer to earn points and
            unlock exclusive badges.
          </p>
        </div>

        <TopRecruitsScroll />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <section id="leaderboard" className="py-12">
              <AdvancedLeaderboard currentUserId={currentUser?.id} useMockData={true} className="mb-6" />
            </section>
          </div>

          <div className="space-y-6">
            <ShareToUnlock
              badgeType="chat-participation"
              badgeName="Community Advocate"
              badgeDescription="Unlock this badge by sharing the SFDSA recruitment program with your network"
              requiredShares={2}
            />

            <ReferRecruiter />

            <ShareToUnlock
              badgeType="dedicated-applicant"
              badgeName="Recruitment Champion"
              badgeDescription="Elite badge earned by those who help grow our recruitment community"
              requiredShares={3}
            />
          </div>
        </div>
      </main>

      <ImprovedFooter />
    </>
  )
}
