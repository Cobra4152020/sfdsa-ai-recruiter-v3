import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface BadgeRequirementsProps {
  requirements: string[]
  progress: number
}

export function BadgeRequirements({ requirements, progress }: BadgeRequirementsProps) {
  const completedCount = Math.floor((progress / 100) * requirements.length)

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Requirements</h3>
      <ul className="space-y-3">
        {requirements.map((requirement, index) => (
          <li key={index} className="flex items-start gap-2">
            {index < completedCount ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <span className={index < completedCount ? "text-gray-900" : "text-gray-600"}>
              {requirement}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
} 