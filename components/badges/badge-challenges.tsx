import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BadgeChallenge, Badge } from '@/types/badge'
import { AchievementBadge } from '@/components/achievement-badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface BadgeChallengesProps {
  challenges: BadgeChallenge[]
  onChallengeProgress?: (challengeId: string, progress: Record<string, any>) => void
  className?: string
}

export function BadgeChallenges({
  challenges,
  onChallengeProgress,
  className,
}: BadgeChallengesProps) {
  const [expandedChallenges, setExpandedChallenges] = useState<Set<string>>(new Set())

  const toggleChallenge = (challengeId: string) => {
    const newExpanded = new Set(expandedChallenges)
    if (newExpanded.has(challengeId)) {
      newExpanded.delete(challengeId)
    } else {
      newExpanded.add(challengeId)
    }
    setExpandedChallenges(newExpanded)
  }

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const distance = end - now

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return { days, hours }
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {challenges.map((challenge) => {
        const timeRemaining = challenge.endDate ? getTimeRemaining(challenge.endDate) : null

        return (
          <Collapsible
            key={challenge.id}
            open={expandedChallenges.has(challenge.id)}
            onOpenChange={() => toggleChallenge(challenge.id)}
          >
            <Card>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {challenge.name}
                    </CardTitle>
                    <CardDescription>
                      {challenge.description}
                    </CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {expandedChallenges.has(challenge.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                {timeRemaining && (
                  <div className="absolute top-4 right-16 flex items-center gap-2 text-yellow-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {timeRemaining.days}d {timeRemaining.hours}h remaining
                    </span>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {challenge.xpReward} XP Reward
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>Special Challenge</span>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {Object.entries(challenge.requirements).map(([key, value]) => (
                          <li key={key} className="text-sm text-muted-foreground">
                            {value as string}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Progress</h4>
                      <Progress value={0} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Start completing requirements to make progress
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => onChallengeProgress?.(challenge.id, { started: true })}
                      >
                        Accept Challenge
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  )
} 