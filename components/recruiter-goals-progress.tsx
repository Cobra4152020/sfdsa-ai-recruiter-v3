"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingUp } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
}

const initialGoals: Goal[] = [
  {
    id: "referrals",
    title: "Monthly Referrals",
    description: "Refer 5 qualified candidates this month.",
    target: 5,
    current: 2,
    unit: "referrals",
  },
  {
    id: "hires",
    title: "Quarterly Hires",
    description: "Achieve 2 successful hires this quarter.",
    target: 2,
    current: 1,
    unit: "hires",
  },
  {
    id: "interviews",
    title: "Interviews Scheduled",
    description: "Schedule 4 interviews for your referrals this month.",
    target: 4,
    current: 3,
    unit: "interviews",
  },
  {
    id: "retention",
    title: "Retention Rate",
    description: "Maintain a 75%+ retention rate for your hires.",
    target: 75,
    current: 80,
    unit: "%",
  },
]

export function RecruiterGoalsProgress() {
  const [goals] = useState<Goal[]>(initialGoals)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Recruiter Goals Progress</CardTitle>
        <CardDescription>
          Track your progress towards key recruiting goals. These targets are set to be challenging but achievable for dedicated recruiters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100))
          const completed = percent >= 100
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-lg flex items-center gap-2">
                    {goal.title}
                    {completed ? <CheckCircle className="text-green-600 h-5 w-5" /> : <TrendingUp className="text-blue-600 h-5 w-5" />}
                  </div>
                  <div className="text-sm text-gray-500">{goal.description}</div>
                </div>
                <div className="text-right min-w-[80px] font-semibold">
                  {goal.current} / {goal.target} {goal.unit}
                </div>
              </div>
              <Progress value={percent} className={completed ? "bg-green-100" : ""} />
              <div className="text-xs text-gray-400 text-right">{percent}%</div>
            </div>
          )
        })}
        <div className="pt-2 text-xs text-gray-500">
          Goals are updated monthly and quarterly. Keep up the great work!
        </div>
      </CardContent>
    </Card>
  )
}

export default RecruiterGoalsProgress 