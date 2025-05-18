import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge, BadgeCollection } from '@/types/badge'
import { AchievementBadge } from '@/components/achievement-badge'
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

interface BadgeCollectionGridProps {
  collections: BadgeCollection[]
  onBadgeClick?: (badge: Badge) => void
  className?: string
}

export function BadgeCollectionGrid({
  collections,
  onBadgeClick,
  className,
}: BadgeCollectionGridProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  const toggleCollection = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId)
    } else {
      newExpanded.add(collectionId)
    }
    setExpandedCollections(newExpanded)
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {collections.map((collection) => (
        <Collapsible
          key={collection.id}
          open={expandedCollections.has(collection.id)}
          onOpenChange={() => toggleCollection(collection.id)}
        >
          <Card>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {collection.name}
                  </CardTitle>
                  <CardDescription>
                    {collection.description}
                  </CardDescription>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {expandedCollections.has(collection.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              {collection.specialReward && (
                <div className="absolute top-4 right-16 flex items-center gap-2 text-yellow-500">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Special Reward: {collection.specialReward}
                  </span>
                </div>
              )}
              <div className="mt-2 flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {collection.badges.length} Badges
                </div>
                {collection.progress !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    {Math.round(collection.progress * 100)}% Complete
                  </div>
                )}
                {collection.isComplete && (
                  <div className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Completed
                  </div>
                )}
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {collection.badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onBadgeClick?.(badge)}
                    >
                      <AchievementBadge
                        type={badge.type}
                        rarity={badge.rarity}
                        points={badge.points}
                        earned={true}
                        size="md"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
} 