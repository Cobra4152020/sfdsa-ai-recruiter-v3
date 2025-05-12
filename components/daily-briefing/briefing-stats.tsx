"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Share2, Award, Flame } from "lucide-react"
import type { BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"

interface BriefingStatsProps {
  stats: BriefingStatsType
  userStreak?: number
}

export function BriefingStats({ stats, userStreak = 0 }: BriefingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Users className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
            Total Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">{stats.total_attendees}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recruits who viewed today's briefing</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Share2 className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
            Total Shares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">{stats.total_shares}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Times this briefing was shared</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Award className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
            Your Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
            {stats.user_platforms_shared.length} / 5
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platforms you've shared on today</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
            <Flame className="h-4 w-4 mr-2 text-orange-500" />
            Your Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">{userStreak} days</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your daily briefing attendance streak</p>
        </CardContent>
      </Card>
    </div>
  )
}
