"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Share2, Award, Flame } from "lucide-react"
import type { BriefingStats as BriefingStatsType } from "@/lib/daily-briefing-service"

interface BriefingStatsProps {
  stats: BriefingStatsType
  userStreak?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

export function BriefingStats({ stats, userStreak = 0 }: BriefingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
              Total Attendees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              {stats.total_attendees}
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recruits who viewed today's briefing</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Share2 className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
              Total Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              {stats.total_shares}
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Times this briefing was shared</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Award className="h-4 w-4 mr-2 text-[#0A3C1F] dark:text-[#FFD700]" />
              Your Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            >
              {stats.user_platforms_shared.length} / 5
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platforms you've shared on today</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-500" />
              Your Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            >
              {userStreak} days
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your daily briefing attendance streak</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
