import type { Database } from "@/types/supabase-types"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

type Challenge = Database["public"]["Tables"]["active_tiktok_challenges"]["Row"]

interface TiktokChallengesListProps {
  challenges: Challenge[]
}

export function TiktokChallengesList({ challenges }: TiktokChallengesListProps) {
  if (challenges.length === 0) {
    return <div className="text-center py-4">No active challenges found</div>
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{challenge.title}</h3>
            <Badge variant={challenge.status === "active" ? "default" : "secondary"}>{challenge.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{challenge.description}</p>
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-500">{challenge.points_reward} points</div>
            <div className="text-xs text-gray-500">
              Created {formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
