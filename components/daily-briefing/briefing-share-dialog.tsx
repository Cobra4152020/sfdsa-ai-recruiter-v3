"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Twitter, Facebook, Linkedin, Instagram, Mail, Check, Loader2 } from "lucide-react"
import type { DailyBriefing } from "@/lib/daily-briefing-service"

interface BriefingShareDialogProps {
  isOpen: boolean
  onClose: () => void
  onShare: (platform: string) => Promise<boolean>
  briefing: DailyBriefing
  sharedPlatforms: string[]
  isSharing: boolean
}

export function BriefingShareDialog({
  isOpen,
  onClose,
  onShare,
  briefing,
  sharedPlatforms,
  isSharing,
}: BriefingShareDialogProps) {
  const handleShare = async (platform: string) => {
    const success = await onShare(platform)
    if (success) {
      // You could add a success notification here
    }
  }

  const platforms = [
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      color: "bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
      points: 10,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
      points: 10,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800",
      points: 15,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700",
      points: 10,
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700",
      points: 5,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
            Share Today's Briefing
          </DialogTitle>
          <DialogDescription>
            Share Sgt. Ken's briefing on your social platforms to earn points and help spread the word about the San
            Francisco Deputy Sheriff recruitment program.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Choose a platform to share on:</h3>

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {platforms.map((platform, index) => {
                const isShared = sharedPlatforms.includes(platform.id)
                const Icon = platform.icon

                return (
                  <motion.div
                    key={platform.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: isShared ? 1 : 1.02 }}
                  >
                    <Button
                      className={`w-full justify-between ${platform.color} ${
                        isShared ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      onClick={() => !isShared && handleShare(platform.id)}
                      disabled={isShared || isSharing}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        <span>{platform.name}</span>
                      </div>
                      <div className="flex items-center">
                        {isSharing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : isShared ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          >
                            <Check className="h-4 w-4 mr-2" />
                          </motion.div>
                        ) : null}
                        <span>+{platform.points} pts</span>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <motion.div
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            You can share on each platform once per day
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
