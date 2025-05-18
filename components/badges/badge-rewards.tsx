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
  rewards: string[]
  unlocked: boolean
}

export function BadgeRewards({ rewards, unlocked }: BadgeRewardsProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Rewards</h3>
      <ul className="space-y-3">
        {rewards.map((reward, index) => (
          <li key={index} className="flex items-start gap-2">
            {unlocked ? (
              <Gift className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Lock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <span className={unlocked ? "text-gray-900" : "text-gray-600"}>
              {reward}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
} 