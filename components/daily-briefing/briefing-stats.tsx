"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Award, TrendingUp, Clock } from "lucide-react"

type BriefingStatsProps = {
  currentStreak: number
  longestStreak: number
  totalAttended: number
  totalPoints: number
  lastAttendance: string | null
}

export function BriefingStats({
  currentStreak,
  longestStreak,
  totalAttended,
  totalPoints,
  lastAttendance,
}: BriefingStatsProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Your Briefing Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mb-2">
              <TrendingUp size={20} />
            </div>
            <div className="text-2xl font-bold text-blue-700">{currentStreak}</div>
            <div className="text-sm text-blue-600">Current Streak</div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mb-2">
              <Award size={20} />
            </div>
            <div className="text-2xl font-bold text-green-700">{longestStreak}</div>
            <div className="text-sm text-green-600">Longest Streak</div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 mb-2">
              <CalendarDays size={20} />
            </div>
            <div className="text-2xl font-bold text-purple-700">{totalAttended}</div>
            <div className="text-sm text-purple-600">Briefings Attended</div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 mb-2">
              <Clock size={20} />
            </div>
            <div className="text-2xl font-bold text-amber-700">{totalPoints}</div>
            <div className="text-sm text-amber-600">Points Earned</div>
          </div>
        </div>

        {lastAttendance && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Last briefing attended: {new Date(lastAttendance).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
