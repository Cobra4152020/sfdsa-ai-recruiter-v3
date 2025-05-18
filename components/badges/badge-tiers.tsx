import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BadgeTier } from '@/types/badge'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BadgeTiersProps {
  tiers: BadgeTier[]
  currentTier: number
  currentXP: number
  className?: string
}

export function BadgeTiers({
  tiers,
  currentTier,
  currentXP,
  className,
}: BadgeTiersProps) {
  const nextTier = useMemo(() => {
    return tiers.find(tier => tier.tierLevel > currentTier)
  }, [tiers, currentTier])

  const progressToNextTier = useMemo(() => {
    if (!nextTier) return 100
    const currentTierXP = tiers.find(t => t.tierLevel === currentTier)?.xpRequired || 0
    const progress = ((currentXP - currentTierXP) / (nextTier.xpRequired - currentTierXP)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }, [tiers, currentTier, currentXP, nextTier])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Current Tier Progress</CardTitle>
          <CardDescription>
            {nextTier
              ? `${Math.round(progressToNextTier)}% progress to Tier ${nextTier.tierLevel}`
              : 'Maximum tier reached!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressToNextTier} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current XP: {currentXP}</span>
              {nextTier && <span>Next Tier: {nextTier.xpRequired} XP</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progression</CardTitle>
          <CardDescription>
            Your journey through badge tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />

            {/* Tier Points */}
            <div className="relative grid grid-cols-5 gap-4">
              {tiers.map((tier, index) => {
                const isCompleted = currentTier >= tier.tierLevel
                const isCurrent = currentTier === tier.tierLevel

                return (
                  <TooltipProvider key={tier.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isCurrent ? 1.1 : 1 }}
                            className={cn(
                              'relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200',
                              isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <Star className="h-5 w-5" />
                            {index < tiers.length - 1 && (
                              <ChevronRight className="absolute -right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            )}
                          </motion.div>
                          <div className="mt-2 text-center">
                            <div className="font-medium text-sm">
                              Tier {tier.tierLevel}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tier.xpRequired} XP
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-medium">{tier.name}</div>
                          <div className="mt-1">
                            <strong>Requirements:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {tier.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 