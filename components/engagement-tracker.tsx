"use client"

import { EnhancedLeaderboard } from "./enhanced-leaderboard"
import { useUser } from "@/context/user-context"

export function EnhancementTracker() {
  const { currentUser } = useUser()

  return (
    <div className="space-y-6">
      <EnhancedLeaderboard currentUserId={currentUser?.id} useMockData={true} />
    </div>
  )
}
