"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AchievementBadge } from "./achievement-badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import confetti from "canvas-confetti"

type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader"

interface BadgeEarnedPopupProps {
  badgeType: BadgeType
  badgeName: string
  badgeDescription: string
  onClose: () => void
}

export function BadgeEarnedPopup({ badgeType, badgeName, badgeDescription, onClose }: BadgeEarnedPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Trigger confetti when the popup appears
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
    })

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      handleClose()
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for exit animation to complete
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="relative bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 p-4 text-white">
              <h2 className="text-xl font-bold text-center">Badge Earned!</h2>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-white hover:bg-white/20 rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="p-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <AchievementBadge type={badgeType} size="lg" earned={true} />
              </motion.div>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-[#0A3C1F] dark:text-[#FFD700]">{badgeName}</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{badgeDescription}</p>
              </motion.div>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" onClick={handleClose}>
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
