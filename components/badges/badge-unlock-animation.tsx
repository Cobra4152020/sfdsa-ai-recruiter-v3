import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy } from "lucide-react"
import type { Badge } from "@/types/badge"

interface BadgeUnlockAnimationProps {
  badge: Pick<Badge, 'name' | 'type' | 'points'>
  onComplete: () => void
}

export function BadgeUnlockAnimation({ badge, onComplete }: BadgeUnlockAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-white rounded-lg p-8 text-center space-y-4"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1, repeat: 1 }}
          >
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-900"
          >
            Badge Unlocked!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600"
          >
            Congratulations! You've earned the {badge.name} badge
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg font-semibold text-yellow-600"
          >
            +{badge.points} points
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 