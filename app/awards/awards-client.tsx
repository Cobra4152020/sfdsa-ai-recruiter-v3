"use client";

import { useState, useEffect } from "react"
import { AdvancedLeaderboard } from "@/components/advanced-leaderboard"
import { ShareToUnlock } from "@/components/share-to-unlock"
import { ReferRecruiter } from "@/components/refer-recruiter"
import { useUser } from "@/context/user-context"
import { TopRecruitsScroll } from "@/components/top-recruits-scroll"

export default function AwardsClient() {
  const [mounted, setMounted] = useState(false)
  const { currentUser } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">Top Recruit Awards</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Recognize outstanding achievement in our recruitment program. Like, share, and refer to earn points and
          unlock exclusive badges.
        </p>
      </div>

      <TopRecruitsScroll />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <ShareToUnlock
          badgeType="chat-participation"
          badgeName="Community Advocate"
          badgeDescription="Unlock this badge by sharing the SFDSA recruitment program with your network"
          requiredShares={2}
        />
        <ReferRecruiter />
      </div>

      <div className="mt-12">
        <AdvancedLeaderboard />
      </div>
    </main>
  )
} 