"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { useUser } from "@/context/user-context"
import { createClient } from "@/lib/supabase-clients"

export function BriefingStreakBadge() {
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useUser()

  useEffect(() => {
    const fetchStreak = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()

        // This is a placeholder - you would need to implement the actual streak calculation
        // in your database, possibly via a function like get_user_briefing_streak
        const { data, error } = await supabase
          .from("user_briefing_stats")
          .select("streak")
          .eq("user_id", currentUser.id)
          .single()

        if (error) {
          console.error("Error fetching streak:", error)
          return
        }

        if (data) {
          setStreak(data.streak || 0)
        }
      } catch (error) {
        console.error("Exception in fetchStreak:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStreak()
  }, [currentUser])

  if (isLoading || !currentUser || streak === 0) {
    return null
  }

  // Determine badge color based on streak length
  let badgeColor = "bg-blue-500"
  if (streak >= 30) {
    badgeColor = "bg-purple-600"
  } else if (streak >= 14) {
    badgeColor = "bg-red-500"
  } else if (streak >= 7) {
    badgeColor = "bg-orange-500"
  }

  return (
    <motion.div
      className={`${badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center`}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <Flame className="h-3 w-3 mr-1 inline" />
      </motion.div>
      {streak} day streak
    </motion.div>
  )
}
