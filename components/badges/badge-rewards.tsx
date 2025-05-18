import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Lock, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BadgeReward } from '@/types/badge'
import { Button } from '@/components/ui/button'
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

interface BadgeRewardsProps {
  rewards: BadgeReward[]
  currentTier: number
  onClaimReward?: (rewardId: string) => void
  className?: string
}

export function BadgeRewards({
  rewards,
  currentTier,
  onClaimReward,
  className,
}: BadgeRewardsProps) {
  const [expandedRewards, setExpandedRewards] = useState<Set<string>>(new Set())

  const toggleReward = (rewardId: string) => {
    const newExpanded = new Set(expandedRewards)
    if (newExpanded.has(rewardId)) {
      newExpanded.delete(rewardId)
    } else {
      newExpanded.add(rewardId)
    }
    setExpandedRewards(newExpanded)
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return '🎮'
      case 'content':
        return '📚'
      case 'physical':
        return '🎁'
      case 'points':
        return '⭐'
      default:
        return '🏆'
    }
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {rewards.map((reward) => {
        const isUnlocked = currentTier >= reward.requiredTier
        const isExpanded = expandedRewards.has(reward.id)

        return (
          <Collapsible
            key={reward.id}
            open={isExpanded}
            onOpenChange={() => toggleReward(reward.id)}
          >
            <Card className={cn(
              'transition-colors duration-200',
              !isUnlocked && 'opacity-75'
            )}>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getRewardIcon(reward.rewardType)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {reward.rewardData.title || 'Mystery Reward'}
                      </CardTitle>
                      <CardDescription>
                        {isUnlocked
                          ? reward.rewardData.description
                          : `Unlock at Tier ${reward.requiredTier}`}
                      </CardDescription>
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    {isUnlocked ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Locked</span>
                      </>
                    )}
                  </div>
                  {reward.rewardType === 'points' && (
                    <div className="text-sm text-muted-foreground">
                      +{reward.rewardData.points} Points
                    </div>
                  )}
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {isUnlocked ? (
                        <>
                          <div className="prose prose-sm dark:prose-invert">
                            {reward.rewardData.content}
                          </div>
                          {reward.isActive && onClaimReward && (
                            <div className="flex justify-end">
                              <Button
                                onClick={() => onClaimReward(reward.id)}
                                className="gap-2"
                              >
                                <Gift className="h-4 w-4" />
                                Claim Reward
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center py-6 text-center">
                          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Reach Tier {reward.requiredTier} to unlock this reward
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  )
} 