import { CheckCircle2, Circle } from "lucide-react"
import type { Badge } from "@/types/badge"

interface BadgeRequirementsProps {
  requirements: Badge['requirements']
  progress: number
}

export function BadgeRequirements({ requirements, progress }: BadgeRequirementsProps) {
  const completedCount = Math.floor((progress / 100) * requirements.length)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Requirements</h3>
      <ul className="space-y-2">
        {requirements.map((requirement, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index < completedCount ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
            <span className={index < completedCount ? "text-green-700" : "text-gray-600"}>
              {requirement}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
} 