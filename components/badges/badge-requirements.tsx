import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Trophy } from "lucide-react"

interface BadgeRequirementsProps {
  requirements: string[]
  rewards?: string[]
  earned?: boolean
  progress?: number
}

export function BadgeRequirements({ requirements, rewards = [], earned = false, progress = 0 }: BadgeRequirementsProps) {
  const completedCount = Math.floor((progress / 100) * requirements.length)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Requirements</h3>
        <ul className="space-y-3">
          {requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-2">
              {earned || index < completedCount ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <span className={earned || index < completedCount ? "text-gray-900" : "text-gray-600"}>
                {requirement}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {rewards && rewards.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Rewards
          </h3>
          <ul className="space-y-2">
            {rewards.map((reward, index) => (
              <li key={index} className="text-gray-600">
                {reward}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 